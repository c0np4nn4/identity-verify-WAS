# 1. start a new "powers of tau" ceremony
snarkjs powersoftau new bn128 14 pot14_0000.ptau -v

# 2. contribute to the ceremony
snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="First contribution" -v

# 3. `circuit-specific` phase (a.k.a phase2)
snarkjs powersoftau prepare phase2 pot14_0001.ptau pot14_final.ptau -v

# 4. remove unnecessary files
rm pot14_0000.ptau
rm pot14_0001.ptau
