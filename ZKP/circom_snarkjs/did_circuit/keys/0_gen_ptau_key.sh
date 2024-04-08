# 1. start a new "powers of tau" ceremony
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v

# 2. contribute to the ceremony
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v

# 3. `circuit-specific` phase (a.k.a phase2)
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
