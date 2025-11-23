import * as StellarSdk from '@stellar/stellar-sdk'

const RPC_URL = import.meta.env.VITE_STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org'
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET

export const server = new StellarSdk.SorobanRpc.Server(RPC_URL)

/**
 * Get account from Stellar network
 */
export async function getAccount(publicKey) {
  try {
    const account = await server.getAccount(publicKey)
    return account
  } catch (error) {
    console.error('Failed to get account:', error)
    throw error
  }
}

/**
 * Build and submit transaction
 */
export async function submitTransaction(transaction, signers) {
  try {
    // Sign transaction
    for (const signer of signers) {
      transaction.sign(signer)
    }

    // Submit to network
    const response = await server.sendTransaction(transaction)
    
    // Wait for confirmation
    let status = response.status
    while (status === 'PENDING' || status === 'NOT_FOUND') {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const statusResponse = await server.getTransaction(response.hash)
      status = statusResponse.status
    }

    if (status === 'SUCCESS') {
      return response
    } else {
      throw new Error(`Transaction failed with status: ${status}`)
    }
  } catch (error) {
    console.error('Failed to submit transaction:', error)
    throw error
  }
}

/**
 * Invoke smart contract
 */
export async function invokeContract(contractId, method, params, sourceAccount) {
  try {
    const contract = new StellarSdk.Contract(contractId)
    
    const operation = contract.call(method, ...params)
    
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build()

    return transaction
  } catch (error) {
    console.error('Failed to invoke contract:', error)
    throw error
  }
}

/**
 * Format XLM amount (stroops to XLM)
 */
export function formatXLM(stroops) {
  return (stroops / 10000000).toFixed(2)
}

/**
 * Parse XLM amount (XLM to stroops)
 */
export function parseXLM(xlm) {
  return Math.floor(parseFloat(xlm) * 10000000)
}

export default {
  server,
  getAccount,
  submitTransaction,
  invokeContract,
  formatXLM,
  parseXLM,
}
