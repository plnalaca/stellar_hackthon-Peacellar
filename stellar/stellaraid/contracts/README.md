# Peacellar Smart Contracts

This directory contains the Soroban smart contracts for the Peacellar platform.

## Contracts

### Campaign Contract
Manages campaign creation, milestones, and lifecycle.

**Key Functions:**
- `create_campaign`: Create a new donation campaign
- `get_campaign`: Retrieve campaign information
- `record_donation`: Record a donation (called by donation contract)
- `update_milestone`: Update milestone with proof of completion
- `vote_milestone`: Vote on milestone completion
- `complete_campaign`: Mark campaign as completed

## Development

### Prerequisites
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add wasm target
rustup target add wasm32-unknown-unknown

# Install Stellar CLI
cargo install --locked stellar-cli

# Generate test account
stellar keys generate deployer --network testnet
```

### Build
```bash
chmod +x build.sh
./build.sh
```

### Test
```bash
cd campaign
cargo test
```

### Deploy
```bash
chmod +x deploy.sh
./deploy.sh
```

## Contract Structure

```
contracts/
├── campaign/
│   ├── src/
│   │   └── lib.rs
│   └── Cargo.toml
├── build.sh
├── deploy.sh
└── README.md
```
