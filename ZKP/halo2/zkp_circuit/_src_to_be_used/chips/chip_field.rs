use halo2_proofs::{
    arithmetic::Field,
    circuit::Chip,
    plonk::{Advice, Column, ConstraintSystem, Instance},
};
use std::marker::PhantomData;

use super::chip_mul::MulConfig;
use super::{
    chip_add::{AddChip, AddConfig},
    chip_mul::MulChip,
};

pub struct FieldChip<F: Field> {
    pub config: FieldConfig,
    pub _marker: PhantomData<F>,
}

#[derive(Clone, Debug)]
pub struct FieldConfig {
    pub advice: [Column<Advice>; 2],

    pub instance: Column<Instance>,

    pub add_config: AddConfig,
    pub mul_config: MulConfig,
}

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

impl<F: Field> FieldChip<F> {
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
