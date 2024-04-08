use halo2_proofs::{
    arithmetic::Field,
    circuit::{Chip, Layouter, Value},
    plonk::Error,
};

use crate::chips::chip_field::FieldChip;

use super::{inst_add::AddInstructions, inst_mul::MulInstructions, Number};

pub trait FieldInstructions<F: Field>: AddInstructions<F> + MulInstructions<F> {
    type Num;

    fn load_private(
        &self,
        layouter: impl Layouter<F>,
        a: Value<F>,
    ) -> Result<<Self as FieldInstructions<F>>::Num, Error>;

    fn add_and_mul(
        &self,
        layouter: &mut impl Layouter<F>,
        a: <Self as FieldInstructions<F>>::Num,
        b: <Self as FieldInstructions<F>>::Num,
        c: <Self as FieldInstructions<F>>::Num,
    ) -> Result<<Self as FieldInstructions<F>>::Num, Error>;

    fn expose_public(
        &self,
        layouter: impl Layouter<F>,
        num: <Self as FieldInstructions<F>>::Num,
        row: usize,
    ) -> Result<(), Error>;
}

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
