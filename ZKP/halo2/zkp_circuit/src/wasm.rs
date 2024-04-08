use std::marker::PhantomData;

use halo2_proofs::{
    arithmetic::Field,
    circuit::{AssignedCell, Chip, Layouter, Region, SimpleFloorPlanner, Value},
    pasta::{group::ff::PrimeField, EqAffine, Fp},
    plonk::{
        create_proof, keygen_pk, keygen_vk, verify_proof, Advice, Circuit, Column,
        ConstraintSystem, Error, Instance, Selector, SingleVerifier,
    },
    poly::{commitment::Params, Rotation},
    transcript::{Blake2bRead, Blake2bWrite, Challenge255},
};

use rand_core::OsRng;
pub use wasm_bindgen::prelude::*;

pub use wasm_bindgen_rayon::init_thread_pool;

// ANCHOR: field-instructions
/// A variable representing a number.
#[derive(Clone)]
struct Number<F: Field>(AssignedCell<F, F>);

trait FieldInstructions<F: Field>: AddInstructions<F> + MulInstructions<F> {
    /// Variable representing a number.
    type Num;

    /// Loads a number into the circuit as a private input.
    fn load_private(
        &self,
        layouter: impl Layouter<F>,
        a: Value<F>,
    ) -> Result<<Self as FieldInstructions<F>>::Num, Error>;

    /// Returns `d = (a + b) * c`.
    fn add_and_mul(
        &self,
        layouter: &mut impl Layouter<F>,
        a: <Self as FieldInstructions<F>>::Num,
        b: <Self as FieldInstructions<F>>::Num,
        c: <Self as FieldInstructions<F>>::Num,
    ) -> Result<<Self as FieldInstructions<F>>::Num, Error>;

    /// Exposes a number as a public input to the circuit.
    fn expose_public(
        &self,
        layouter: impl Layouter<F>,
        num: <Self as FieldInstructions<F>>::Num,
        row: usize,
    ) -> Result<(), Error>;
}
// ANCHOR_END: field-instructions

// ANCHOR: add-instructions
trait AddInstructions<F: Field>: Chip<F> {
    /// Variable representing a number.
    type Num;

    /// Returns `c = a + b`.
    fn add(
        &self,
        layouter: impl Layouter<F>,
        a: Self::Num,
        b: Self::Num,
    ) -> Result<Self::Num, Error>;
}
// ANCHOR_END: add-instructions

// ANCHOR: mul-instructions
trait MulInstructions<F: Field>: Chip<F> {
    /// Variable representing a number.
    type Num;

    /// Returns `c = a * b`.
    fn mul(
        &self,
        layouter: impl Layouter<F>,
        a: Self::Num,
        b: Self::Num,
    ) -> Result<Self::Num, Error>;
}
// ANCHOR_END: mul-instructions

// ANCHOR: field-config
// The top-level config that provides all necessary columns and permutations
// for the other configs.
#[derive(Clone, Debug)]
pub struct FieldConfig {
    /// For this chip, we will use two advice columns to implement our instructions.
    /// These are also the columns through which we communicate with other parts of
    /// the circuit.
    advice: [Column<Advice>; 2],

    /// Public inputs
    instance: Column<Instance>,

    add_config: AddConfig,
    mul_config: MulConfig,
}
// ANCHOR END: field-config

// ANCHOR: add-config
#[derive(Clone, Debug)]
struct AddConfig {
    advice: [Column<Advice>; 2],
    s_add: Selector,
}
// ANCHOR_END: add-config

// ANCHOR: mul-config
#[derive(Clone, Debug)]
struct MulConfig {
    advice: [Column<Advice>; 2],
    s_mul: Selector,
}
// ANCHOR END: mul-config

// ANCHOR: field-chip
/// The top-level chip that will implement the `FieldInstructions`.
struct FieldChip<F: Field> {
    config: FieldConfig,
    _marker: PhantomData<F>,
}
// ANCHOR_END: field-chip

// ANCHOR: add-chip
struct AddChip<F: Field> {
    config: AddConfig,
    _marker: PhantomData<F>,
}
// ANCHOR END: add-chip

// ANCHOR: mul-chip
struct MulChip<F: Field> {
    config: MulConfig,
    _marker: PhantomData<F>,
}
// ANCHOR_END: mul-chip

// ANCHOR: add-chip-trait-impl
impl<F: Field> Chip<F> for AddChip<F> {
    type Config = AddConfig;
    type Loaded = ();

    fn config(&self) -> &Self::Config {
        &self.config
    }

    fn loaded(&self) -> &Self::Loaded {
        &()
    }
}
// ANCHOR END: add-chip-trait-impl

// ANCHOR: add-chip-impl
impl<F: Field> AddChip<F> {
    fn construct(config: <Self as Chip<F>>::Config, _loaded: <Self as Chip<F>>::Loaded) -> Self {
        Self {
            config,
            _marker: PhantomData,
        }
    }

    fn configure(
        meta: &mut ConstraintSystem<F>,
        advice: [Column<Advice>; 2],
    ) -> <Self as Chip<F>>::Config {
        let s_add = meta.selector();

        // Define our addition gate!
        meta.create_gate("add", |meta| {
            let lhs = meta.query_advice(advice[0], Rotation::cur());
            let rhs = meta.query_advice(advice[1], Rotation::cur());
            let out = meta.query_advice(advice[0], Rotation::next());
            let s_add = meta.query_selector(s_add);

            vec![s_add * (lhs + rhs - out)]
        });

        AddConfig { advice, s_add }
    }
}
// ANCHOR END: add-chip-impl

// ANCHOR: add-instructions-impl
impl<F: Field> AddInstructions<F> for FieldChip<F> {
    type Num = Number<F>;
    fn add(
        &self,
        layouter: impl Layouter<F>,
        a: Self::Num,
        b: Self::Num,
    ) -> Result<Self::Num, Error> {
        let config = self.config().add_config.clone();

        let add_chip = AddChip::<F>::construct(config, ());
        add_chip.add(layouter, a, b)
    }
}

impl<F: Field> AddInstructions<F> for AddChip<F> {
    type Num = Number<F>;

    fn add(
        &self,
        mut layouter: impl Layouter<F>,
        a: Self::Num,
        b: Self::Num,
    ) -> Result<Self::Num, Error> {
        let config = self.config();

        layouter.assign_region(
            || "add",
            |mut region: Region<'_, F>| {
                // We only want to use a single addition gate in this region,
                // so we enable it at region offset 0; this means it will constrain
                // cells at offsets 0 and 1.
                config.s_add.enable(&mut region, 0)?;

                // The inputs we've been given could be located anywhere in the circuit,
                // but we can only rely on relative offsets inside this region. So we
                // assign new cells inside the region and constrain them to have the
                // same values as the inputs.
                a.0.copy_advice(|| "lhs", &mut region, config.advice[0], 0)?;
                b.0.copy_advice(|| "rhs", &mut region, config.advice[1], 0)?;

                // Now we can compute the addition result, which is to be assigned
                // into the output position.
                let value = a.0.value().copied() + b.0.value();

                // Finally, we do the assignment to the output, returning a
                // variable to be used in another part of the circuit.
                region
                    .assign_advice(|| "lhs + rhs", config.advice[0], 1, || value)
                    .map(Number)
            },
        )
    }
}
// ANCHOR END: add-instructions-impl

// ANCHOR: mul-chip-trait-impl
impl<F: Field> Chip<F> for MulChip<F> {
    type Config = MulConfig;
    type Loaded = ();

    fn config(&self) -> &Self::Config {
        &self.config
    }

    fn loaded(&self) -> &Self::Loaded {
        &()
    }
}
// ANCHOR END: mul-chip-trait-impl

// ANCHOR: mul-chip-impl
impl<F: Field> MulChip<F> {
    fn construct(config: <Self as Chip<F>>::Config, _loaded: <Self as Chip<F>>::Loaded) -> Self {
        Self {
            config,
            _marker: PhantomData,
        }
    }

    fn configure(
        meta: &mut ConstraintSystem<F>,
        advice: [Column<Advice>; 2],
    ) -> <Self as Chip<F>>::Config {
        for column in &advice {
            meta.enable_equality(*column);
        }
        let s_mul = meta.selector();

        meta.create_gate("mul", |meta| {
            let lhs = meta.query_advice(advice[0], Rotation::cur());
            let rhs = meta.query_advice(advice[1], Rotation::cur());
            let out = meta.query_advice(advice[0], Rotation::next());
            let s_mul = meta.query_selector(s_mul);

            vec![s_mul * (lhs * rhs - out)]
        });

        MulConfig { advice, s_mul }
    }
}
// ANCHOR_END: mul-chip-impl

// ANCHOR: mul-instructions-impl
impl<F: Field> MulInstructions<F> for FieldChip<F> {
    type Num = Number<F>;
    fn mul(
        &self,
        layouter: impl Layouter<F>,
        a: Self::Num,
        b: Self::Num,
    ) -> Result<Self::Num, Error> {
        let config = self.config().mul_config.clone();
        let mul_chip = MulChip::<F>::construct(config, ());
        mul_chip.mul(layouter, a, b)
    }
}

impl<F: Field> MulInstructions<F> for MulChip<F> {
    type Num = Number<F>;

    fn mul(
        &self,
        mut layouter: impl Layouter<F>,
        a: Self::Num,
        b: Self::Num,
    ) -> Result<Self::Num, Error> {
        let config = self.config();

        layouter.assign_region(
            || "mul",
            |mut region: Region<'_, F>| {
                config.s_mul.enable(&mut region, 0)?;

                a.0.copy_advice(|| "lhs", &mut region, config.advice[0], 0)?;
                b.0.copy_advice(|| "rhs", &mut region, config.advice[1], 0)?;

                let value = a.0.value().copied() * b.0.value();

                region
                    .assign_advice(|| "lhs * rhs", config.advice[0], 1, || value)
                    .map(Number)
            },
        )
    }
}
// ANCHOR END: mul-instructions-impl

// ANCHOR: field-chip-trait-impl
impl<F: Field> Chip<F> for FieldChip<F> {
    type Config = FieldConfig;
    type Loaded = ();

    fn config(&self) -> &Self::Config {
        &self.config
    }

    fn loaded(&self) -> &Self::Loaded {
        &()
    }
}
// ANCHOR_END: field-chip-trait-impl

// ANCHOR: field-chip-impl
impl<F: Field> FieldChip<F> {
    fn construct(config: <Self as Chip<F>>::Config, _loaded: <Self as Chip<F>>::Loaded) -> Self {
        Self {
            config,
            _marker: PhantomData,
        }
    }

    fn configure(
        meta: &mut ConstraintSystem<F>,
        advice: [Column<Advice>; 2],
        instance: Column<Instance>,
    ) -> <Self as Chip<F>>::Config {
        let add_config = AddChip::configure(meta, advice);
        let mul_config = MulChip::configure(meta, advice);

        meta.enable_equality(instance);

        FieldConfig {
            advice,
            instance,
            add_config,
            mul_config,
        }
    }
}
// ANCHOR_END: field-chip-impl

// ANCHOR: field-instructions-impl
impl<F: Field> FieldInstructions<F> for FieldChip<F> {
    type Num = Number<F>;

    fn load_private(
        &self,
        mut layouter: impl Layouter<F>,
        value: Value<F>,
    ) -> Result<<Self as FieldInstructions<F>>::Num, Error> {
        let config = self.config();

        layouter.assign_region(
            || "load private",
            |mut region| {
                region
                    .assign_advice(|| "private input", config.advice[0], 0, || value)
                    .map(Number)
            },
        )
    }

    /// Returns `d = (a + b) * c`.
    fn add_and_mul(
        &self,
        layouter: &mut impl Layouter<F>,
        a: <Self as FieldInstructions<F>>::Num,
        b: <Self as FieldInstructions<F>>::Num,
        c: <Self as FieldInstructions<F>>::Num,
    ) -> Result<<Self as FieldInstructions<F>>::Num, Error> {
        let ab = self.add(layouter.namespace(|| "a + b"), a, b)?;
        self.mul(layouter.namespace(|| "(a + b) * c"), ab, c)
    }

    fn expose_public(
        &self,
        mut layouter: impl Layouter<F>,
        num: <Self as FieldInstructions<F>>::Num,
        row: usize,
    ) -> Result<(), Error> {
        let config = self.config();

        layouter.constrain_instance(num.0.cell(), config.instance, row)
    }
}
// ANCHOR_END: field-instructions-impl

// ANCHOR: circuit
/// The full circuit implementation.
///
/// In this struct we store the private input variables. We use `Value<F>` because
/// they won't have any value during key generation. During proving, if any of these
/// were `Value::unknown()` we would get an error.
#[derive(Default)]
pub struct MyCircuit<F: Field> {
    major_code: Value<F>,
    //
    signature_r: Value<F>,
    signature_s: Value<F>,
    message: Value<F>,
    // public key == public input (instance)
}

impl<F: Field> Circuit<F> for MyCircuit<F> {
    // Since we are using a single chip for everything, we can just reuse its config.
    type Config = FieldConfig;
    type FloorPlanner = SimpleFloorPlanner;

    fn without_witnesses(&self) -> Self {
        Self::default()
    }

    fn configure(meta: &mut ConstraintSystem<F>) -> Self::Config {
        // We create the two advice columns that FieldChip uses for I/O.
        let advice = [meta.advice_column(), meta.advice_column()];

        // We also need an instance column to store public inputs.
        let instance = meta.instance_column();

        FieldChip::configure(meta, advice, instance)
    }

    fn synthesize(
        &self,
        config: Self::Config,
        mut layouter: impl Layouter<F>,
    ) -> Result<(), Error> {
        let field_chip = FieldChip::<F>::construct(config, ());

        // Load our private values into the circuit.
        let major_code =
            field_chip.load_private(layouter.namespace(|| "load major_code"), self.major_code)?;

        let signature_r =
            field_chip.load_private(layouter.namespace(|| "load signature_r"), self.signature_r)?;

        let signature_s =
            field_chip.load_private(layouter.namespace(|| "load signature_s"), self.signature_s)?;

        let message =
            field_chip.load_private(layouter.namespace(|| "load message"), self.message)?;

        // Use `add_and_mul` to get `d = (a + b) * c`.
        // let d = field_chip.add_and_mul(&mut layouter, a, b, c)?;

        field_chip.ed25519_verify(
            layouter.namespace(|| "ed25519 verify"),
            signature_r,
            signature_s,
            message,
        )?;

        // Expose the result as a public input to the circuit.
        field_chip.expose_public(layouter.namespace(|| "expose major_code"), major_code, 0)
    }
}
// ANCHOR_END: circuit

trait Ed25519Instruction<F: Field>: Chip<F> {
    type Num;

    fn ed25519_verify(
        &self,
        layouter: impl Layouter<F>,
        signature_r: Self::Num,
        signature_s: Self::Num,
        message: Self::Num,
    ) -> Result<(), Error>;
}

impl<F: Field> Ed25519Instruction<F> for FieldChip<F> {
    type Num = Number<F>;

    fn ed25519_verify(
        &self,
        mut layouter: impl Layouter<F>,
        signature_r: Self::Num,
        signature_s: Self::Num,
        message: Self::Num,
    ) -> Result<(), Error> {
        let config = self.config();

        layouter.assign_region(
            || "verify ed25519 signature",
            |mut region: Region<'_, F>| {
                let i_public_key = region.assign_advice_from_instance(
                    || "issuer public key",
                    config.instance,
                    1,                // public input row
                    config.advice[0], // advice column
                    0,                // advice offset
                )?;

                signature_r.0.copy_advice(
                    || "signature r: (1, 0)",
                    &mut region,
                    config.advice[0],
                    1,
                )?;

                signature_s.0.copy_advice(
                    || "signature s: (1, 1)",
                    &mut region,
                    config.advice[1],
                    1,
                )?;

                message
                    .0
                    .copy_advice(|| "message: (2, 0)", &mut region, config.advice[0], 2)?;

                let sig_r = signature_r.0.value().copied();
                let sig_s = signature_s.0.value().copied();
                let msg = message.0.value().copied();

                // TODO verifying signature

                Ok(())
            },
        )?;

        Ok(())
    }
}

#[allow(clippy::many_single_char_names)]
fn main() {
    use halo2_proofs::pasta::Fp;
    use rand_core::OsRng;

    // ANCHOR: test-circuit
    // The number of rows in our circuit cannot exceed 2^k. Since our example
    // circuit is very small, we can pick a very small value here.
    let k = 4;

    // Prepare the private and public inputs to the circuit!
    let rng = OsRng;
    let major_code = Fp::from_u128(245);

    // let d = (a + b) * c;

    // Instantiate the circuit with the private inputs.
    let circuit = MyCircuit {
        // [1] major code check
        major_code: Value::known(major_code),

        // [2] ed25519 signature check
        signature_r: Value::known(Fp::from_u128(111)),
        signature_s: Value::known(Fp::from_u128(222)),
        message: Value::known(Fp::random(rng)),
    };

    {
        let public_inputs = vec![Fp::from_u128(245), Fp::from_u128(65535)];

        // 증명 파라미터 생성
        let params: Params<EqAffine> = Params::new(k);

        // Proving Key 및 Verification Key 생성
        let vk = keygen_vk(&params, &circuit).expect("Verification key 생성 실패");
        let pk = keygen_pk(&params, vk.clone(), &circuit).expect("Proving key 생성 실패");

        // Transcript 초기화
        let mut transcript = Blake2bWrite::<Vec<u8>, _, Challenge255<_>>::init(vec![]);

        // 증명 생성
        create_proof(
            &params,
            &pk,
            &[circuit],
            &[&[&public_inputs]],
            OsRng,
            &mut transcript,
        )
        .expect("증명 생성 실패");

        let proof = transcript.finalize();
        let strategy = SingleVerifier::new(&params);

        println!("ZKP proof: {:?} ...", &proof[..6]);

        // 증명 검증
        let mut transcript = Blake2bRead::<_, _, Challenge255<_>>::init(&proof[..]);
        let res = verify_proof(
            &params, //
            &vk,
            strategy,
            &[&[&public_inputs]],
            &mut transcript,
        );

        assert!(res.is_ok(), "증명 검증 실패");
        println!("증명 검증 성공");
    }
}

#[wasm_bindgen]
pub fn wasm_test(major_code: u64, signature_r: u64, signature_s: u64, msg: u64) -> JsValue {
    let k = 4;
    let params: Params<EqAffine> = Params::new(k);

    let circuit = MyCircuit {
        // [1] major code check
        major_code: Value::known(Fp::from_u128(major_code as u128)),

        // [2] ed25519 signature check
        signature_r: Value::known(Fp::from_u128(signature_r as u128)),
        signature_s: Value::known(Fp::from_u128(signature_s as u128)),
        message: Value::known(Fp::from_u128(msg as u128)),
    };

    let public_inputs = vec![Fp::from_u128(245), Fp::from_u128(65535)];

    let vk = keygen_vk(&params, &circuit).expect("Verification key 생성 실패");
    let pk = keygen_pk(&params, vk.clone(), &circuit).expect("Proving key 생성 실패");

    // Transcript 초기화
    let mut transcript = Blake2bWrite::<Vec<u8>, _, Challenge255<_>>::init(vec![]);

    // 증명 생성
    create_proof(
        &params,
        &pk,
        &[circuit],
        &[&[&public_inputs]],
        OsRng,
        &mut transcript,
    )
    .expect("증명 생성 실패");

    let proof = transcript.finalize();

    JsValue::from_serde(&proof).unwrap()

    // 10 + 20
}
