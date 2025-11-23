#!/bin/bash

# Deploy contracts to Stellar testnet
echo "Deploying contracts to Stellar Testnet..."

# Make sure you have stellar CLI installed and configured
# stellar keys generate deployer --network testnet

NETWORK="testnet"
SOURCE_ACCOUNT="deployer"

echo "Deploying Campaign Contract..."
CAMPAIGN_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellaraid_campaign.wasm \
  --source $SOURCE_ACCOUNT \
  --network $NETWORK)

echo "Campaign Contract ID: $CAMPAIGN_ID"

# Save contract IDs to .env
echo "VITE_CAMPAIGN_CONTRACT_ID=$CAMPAIGN_ID" > ../frontend/.env

echo "✅ Deployment complete!"
echo "Contract IDs saved to frontend/.env"
