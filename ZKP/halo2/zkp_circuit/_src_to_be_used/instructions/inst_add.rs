use crate::chips::{chip_add::AddChip, chip_field::FieldChip};
use halo2_proofs::{
    arithmetic::Field,
    circuit::{Chip, Layouter, Region},
    plonk::Error,
};

use super::Number;

pub trait AddInstructions<F: Field>: Chip<F> {
    type Num;

    fn add(
        &self,
        layouter: impl Layouter<F>,
        a: Self::Num,
        b: Self::Num,
    ) -> Result<Self::Num, Error>;
}

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

        let res = add_chip.add(layouter, a, b);

        res
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

        let res = layouter.assign_region(
            || "add",
            |mut region: Region<'_, F>| {
                config.s_add.enable(&mut region, 0)?;

                a.0.copy_advice(|| "lhs", &mut region, config.advice[0], 0)?;
                b.0.copy_advice(|| "rhs", &mut region, config.advice[1], 0)?;

                let value = a.0.value().copied() + b.0.value();

                region
                    .assign_advice(|| "lhs + rhs", config.advice[0], 1, || value)
                    .map(Number)
            },
        );

        res
    }
}
