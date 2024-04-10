use halo2_proofs::{arithmetic::Field, circuit::AssignedCell};

#[derive(Clone)]
pub struct Number<F: Field>(AssignedCell<F, F>);

pub mod inst_add;
pub mod inst_field;
pub mod inst_mul;
