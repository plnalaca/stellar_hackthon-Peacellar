import { createContext, useState, useContext, useEffect } from 'react'
import { isConnected, requestAccess, getAddress } from '@stellar/freighter-api'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(() => {
    // Initialize from localStorage
    return localStorage.getItem('stellaraid_wallet_address') || null
  })
  const [isWalletConnected, setIsWalletConnected] = useState(() => {
    return localStorage.getItem('stellaraid_wallet_connected') === 'true'
  })
  const [isLoading, setIsLoading] = useState(false)

  // Auto-reconnect on mount if was previously connected
  useEffect(() => {
    const autoReconnect = async () => {
      const savedAddress = localStorage.getItem('stellaraid_wallet_address')
      const wasConnected = localStorage.getItem('stellaraid_wallet_connected') === 'true'
      
      if (wasConnected && savedAddress) {
        try {
          const connectionStatus = await isConnected()
          if (connectionStatus.isConnected) {
            // Verify address is still valid
            const addressResult = await getAddress()
            if (addressResult.address === savedAddress) {
              setWalletAddress(savedAddress)
              setIsWalletConnected(true)
            } else {
              // Address changed, clear storage
              localStorage.removeItem('stellaraid_wallet_address')
              localStorage.removeItem('stellaraid_wallet_connected')
            }
          }
        } catch (error) {
          console.error('Auto-reconnect failed:', error)
        }
      }
    }
    
    autoReconnect()
  }, [])

  const connectWallet = async () => {
    setIsLoading(true)
    try {
      // Check if Freighter is installed
      const connectionStatus = await isConnected()
      
      if (!connectionStatus.isConnected) {
        alert('Lütfen Freighter wallet extension yükleyin: https://www.freighter.app/')
        window.open('https://www.freighter.app/', '_blank')
        return
      }

      // Request access to the wallet (opens Freighter popup if not allowed)
      const accessResult = await requestAccess()
      
      if (accessResult.error) {
        throw new Error(accessResult.error)
      }

      if (accessResult.address) {
        setWalletAddress(accessResult.address)
        setIsWalletConnected(true)
        // Save to localStorage
        localStorage.setItem('stellaraid_wallet_address', accessResult.address)
        localStorage.setItem('stellaraid_wallet_connected', 'true')
        console.log('Wallet connected:', accessResult.address)
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      alert('Cüzdan bağlantısı başarısız oldu: ' + (error.message || 'Bilinmeyen hata'))
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    setIsWalletConnected(false)
    // Clear from localStorage
    localStorage.removeItem('stellaraid_wallet_address')
    localStorage.removeItem('stellaraid_wallet_connected')
  }

  const resetTutorial = () => {
    localStorage.removeItem('peacellar_tutorial_completed')
    window.location.reload()
  }

  const value = {
    walletAddress,
    isConnected: isWalletConnected,
    isLoading,
    connectWallet,
    disconnectWallet,
    resetTutorial,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}
