const wasm = require('./pkg/zkp_circuit');

async function runWasm() {
    await wasm.wasm_test(); // Initializes the Wasm module

    // Now you can call your exported Rust functions, for example:
    // wasm.your_exported_rust_function();
}

const val = runWasm();

console.log(val);
