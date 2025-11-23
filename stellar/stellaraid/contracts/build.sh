#!/bin/bash

# Build all smart contracts
echo "Building Campaign Contract..."
cd contracts/campaign
cargo build --target wasm32-unknown-unknown --release

echo "✅ Build complete!"
echo "WASM files are in target/wasm32-unknown-unknown/release/"
