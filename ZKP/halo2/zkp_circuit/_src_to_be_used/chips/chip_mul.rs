use halo2_proofs::{
    arithmetic::Field,
    circuit::Chip,
    plonk::{Advice, Column, ConstraintSystem, Selector},
    poly::Rotation,
};
use std::marker::PhantomData;

pub struct MulChip<F: Field> {
    pub config: MulConfig,
    pub _marker: PhantomData<F>,
}

#[derive(Clone, Debug)]
pub struct MulConfig {
    pub advice: [Column<Advice>; 2],
    pub s_mul: Selector,
}

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

impl<F: Field> MulChip<F> {
    pub fn construct(
        config: <Self as Chip<F>>::Config,
        _loaded: <Self as Chip<F>>::Loaded,
    ) -> Self {
        Self {
            config,
            _marker: PhantomData,
        }
    }

    pub fn configure(
        meta: &mut ConstraintSystem<F>,
        advice: [Column<Advice>; 2],
    ) -> <Self as Chip<F>>::Config {
        let s_mul = meta.selector();

        // Define our addition gate!
        meta.create_gate("mul_gate", |meta| {
            let lhs = meta.query_advice(advice[0], Rotation::cur());
            let rhs = meta.query_advice(advice[1], Rotation::cur());
            let out = meta.query_advice(advice[0], Rotation::next());
            let s_mul = meta.query_selector(s_mul);

            vec![s_mul * (lhs * rhs - out)]
        });

        MulConfig { advice, s_mul }
    }
}
