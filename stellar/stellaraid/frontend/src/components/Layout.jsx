import { Link, useLocation } from 'react-router-dom'
import { useWallet } from '../contexts/WalletContext'
import { Heart, Menu, X, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function Layout({ children }) {
  const { walletAddress, isConnected, connectWallet, disconnectWallet, resetTutorial } = useWallet()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen animated-gradient">
      {/* Navigation */}
      <nav className="glass backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Heart className="w-10 h-10 text-white fill-white transition-transform group-hover:scale-110" />
                <Sparkles className="w-5 h-5 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">Peacellar</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/" active={isActive('/')}>Home</NavLink>
              <NavLink to="/campaigns" active={isActive('/campaigns')}>Campaigns</NavLink>
              <NavLink to="/create-campaign" active={isActive('/create-campaign')}>Create</NavLink>
              {isConnected && (
                <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
              )}
            </div>

            {/* Wallet Button */}
            <div className="hidden md:block">
              {isConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                    <span className="text-sm font-mono text-white">{formatAddress(walletAddress)}</span>
                  </div>
                  <button onClick={disconnectWallet} className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all backdrop-blur-sm border border-white/30">
                    Disconnect
                  </button>
                </div>
              ) : (
                <button onClick={connectWallet} className="btn-primary flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-stellar-purple"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-white/20">
            <div className="px-4 py-3 space-y-3">
              <Link to="/" className="block text-white hover:text-yellow-300 py-2">Home</Link>
              <Link to="/campaigns" className="block text-white hover:text-yellow-300 py-2">Campaigns</Link>
              <Link to="/create-campaign" className="block text-white hover:text-yellow-300 py-2">Create</Link>
              {isConnected && (
                <Link to="/dashboard" className="block text-white hover:text-yellow-300 py-2">Dashboard</Link>
              )}
              <div className="pt-3 border-t border-white/20">
                {isConnected ? (
                  <>
                    <p className="text-sm text-white/80 mb-3 font-mono">{formatAddress(walletAddress)}</p>
                    <button onClick={disconnectWallet} className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition">
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button onClick={connectWallet} className="btn-primary w-full">
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass backdrop-blur-md mt-20 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="w-8 h-8 text-white fill-white" />
                <span className="text-xl font-extrabold text-white">Peacellar</span>
              </div>
              <p className="text-white/80 text-sm">
                Transparent donations powered by Stellar blockchain technology
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/campaigns" className="block text-white/80 hover:text-white text-sm">Browse Campaigns</Link>
                <Link to="/create-campaign" className="block text-white/80 hover:text-white text-sm">Start Campaign</Link>
                <Link to="/dashboard" className="block text-white/80 hover:text-white text-sm">Dashboard</Link>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3">Resources</h3>
              <div className="space-y-2">
                <a href="https://stellar.org" target="_blank" className="block text-white/80 hover:text-white text-sm">Stellar Network</a>
                <a href="https://github.com" target="_blank" className="block text-white/80 hover:text-white text-sm">GitHub</a>
                <a href="#" className="block text-white/80 hover:text-white text-sm">Documentation</a>
              </div>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-white/20">
            <button
              onClick={resetTutorial}
              className="mb-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition backdrop-blur-sm border border-white/20 text-sm font-medium"
            >
              📚 How to Use
            </button>
            <p className="text-white/60 text-sm">
              © 2025 Peacellar
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-full font-medium transition-all ${
        active 
          ? 'bg-white text-purple-600 shadow-lg' 
          : 'text-white hover:bg-white/20'
      }`}
    >
      {children}
    </Link>
  )
}
