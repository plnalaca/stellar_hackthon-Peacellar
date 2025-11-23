# 🚀 StellarAid - Deployment Information

## Deployment Date
November 23, 2025

## Network
Stellar Testnet

## Smart Contracts

### Campaign Contract ✅
- **Contract ID**: `CCZQ3R7BWR2OWX5UNHBSB4JI5PIZ4Y2W4NPVCBQPGERIBZE37GQQ6JND`
- **WASM Hash**: `1926a1b51b5ec4f3d54ab734410371c6ada35d39094e8a71a97b24e6e6c3cdba`
- **Deployer**: `GCXQBTYPU7GJYWYQTJSGWTUW57Q4SSGHLZ5Z26YH5GGHQFNYFLAKGQLA`
- **Explorer**: https://stellar.expert/explorer/testnet/contract/CCZQ3R7BWR2OWX5UNHBSB4JI5PIZ4Y2W4NPVCBQPGERIBZE37GQQ6JND
- **Transaction**: https://stellar.expert/explorer/testnet/tx/39ce1cb7e7ae2a78de3a0c090bfd643f71be30fb8a3146955b86079fd9da2fcf
- **Status**: Deployed and Active

## Test Accounts

### Deployer Account
- **Public Key**: `GCXQBTYPU7GJYWYQTJSGWTUW57Q4SSGHLZ5Z26YH5GGHQFNYFLAKGQLA`
- **Purpose**: Contract deployment and management
- **Balance**: ~10,000 XLM (testnet)

### User Test Account
- **Public Key**: `GB47HWCYKOBWR6GE67O4M6BCIYRWLVX2NAICRNKNMORJRG3UWAEBFKKT`
- **Purpose**: Testing user interactions
- **Balance**: 10,000 XLM (testnet)

## Contract Functions

### Campaign Contract

#### create_campaign
Creates a new donation campaign
```rust
pub fn create_campaign(
    env: Env,
    creator: Address,
    title: String,
    organization: String,
    description: String,
    goal: i128,
    milestones: Vec<Milestone>,
) -> u64
```

#### get_campaign
Retrieves campaign information
```rust
pub fn get_campaign(env: Env, campaign_id: u64) -> Campaign
```

#### record_donation
Records a new donation
```rust
pub fn record_donation(env: Env, campaign_id: u64, amount: i128)
```

#### update_milestone
Updates milestone with proof of completion
```rust
pub fn update_milestone(
    env: Env,
    campaign_id: u64,
    milestone_id: u32,
    proof_url: String,
)
```

#### vote_milestone
Vote on milestone completion
```rust
pub fn vote_milestone(
    env: Env,
    voter: Address,
    campaign_id: u64,
    milestone_id: u32,
    approve: bool,
)
```

#### complete_campaign
Marks campaign as completed
```rust
pub fn complete_campaign(env: Env, campaign_id: u64)
```

## How to Test

### 1. View Contract on Explorer
Visit: https://stellar.expert/explorer/testnet/contract/CCZQ3R7BWR2OWX5UNHBSB4JI5PIZ4Y2W4NPVCBQPGERIBZE37GQQ6JND

### 2. Invoke Contract from CLI
```bash
# Get campaign info (example)
stellar contract invoke \
  --id CCZQ3R7BWR2OWX5UNHBSB4JI5PIZ4Y2W4NPVCBQPGERIBZE37GQQ6JND \
  --source deployer \
  --network testnet \
  -- \
  get_campaign \
  --campaign_id 1
```

### 3. Test from Frontend
```bash
cd frontend
npm run dev
# Visit http://localhost:5173
```

## Environment Variables

Frontend `.env` file is configured with:
```bash
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_CAMPAIGN_CONTRACT_ID=CCZQ3R7BWR2OWX5UNHBSB4JI5PIZ4Y2W4NPVCBQPGERIBZE37GQQ6JND
VITE_DEPLOYER_ADDRESS=GCXQBTYPU7GJYWYQTJSGWTUW57Q4SSGHLZ5Z26YH5GGHQFNYFLAKGQLA
VITE_USER_ADDRESS=GB47HWCYKOBWR6GE67O4M6BCIYRWLVX2NAICRNKNMORJRG3UWAEBFKKT
```

## Next Steps

1. ✅ Campaign Contract - Deployed
2. 🔄 Frontend Integration - In Progress
3. ⏳ Donation Contract - To be developed
4. ⏳ NFT Certificate System - To be developed
5. ⏳ Governance Contract - To be developed

## Troubleshooting

### Check Contract Status
```bash
stellar contract info \
  --id CCZQ3R7BWR2OWX5UNHBSB4JI5PIZ4Y2W4NPVCBQPGERIBZE37GQQ6JND \
  --network testnet
```

### Get Account Balance
```bash
stellar account balance deployer --network testnet
```

### View Recent Transactions
```bash
curl -s "https://horizon-testnet.stellar.org/accounts/GCXQBTYPU7GJYWYQTJSGWTUW57Q4SSGHLZ5Z26YH5GGHQFNYFLAKGQLA/transactions?limit=10"
```

## Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Docs](https://developers.stellar.org/docs/smart-contracts)
- [Stellar Expert](https://stellar.expert/)
- [Horizon API](https://horizon-testnet.stellar.org/)

---

**Note**: This is a testnet deployment. Do not use real funds. All XLM used is testnet currency only.
