# Usage

```bash
# circuit 을 통해 r1cs, wasm 을 생성합니다.
circuit/0_compile_circom.sh

# pot14 로 최대 16,384 개의 constraint 를 처리할 수 있는 키를 생성합니다.
keys/0_gen_ptau_key.sh

# gen_prf key, vrf_prf key 를 생성합니다.
npm run gen

# proof 를 생성합니다.
npm run prv

# proof 를 검증합니다.
npm run vrf
```

# Utils

- `src/2_gen_prf.js` 의 인자로 들어가는 값은 `utils/gen_inputs.js`를 통해 생성되었습니다.
