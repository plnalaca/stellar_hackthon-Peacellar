import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWallet } from '../contexts/WalletContext'
import { ArrowLeft, CheckCircle, Clock, TrendingUp, Users, Heart } from 'lucide-react'
import * as StellarSdk from '@stellar/stellar-sdk'
import { signTransaction } from '@stellar/freighter-api'

export default function CampaignDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isConnected, connectWallet, walletAddress } = useWallet()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [donationAmount, setDonationAmount] = useState('')
  const [showDonationModal, setShowDonationModal] = useState(false)

  useEffect(() => {
    // TODO: Fetch campaign from blockchain
    setTimeout(() => {
      const mockCampaign = {
        id: id,
        title: 'Education for 100 Children',
        organization: 'Education Foundation',
        description: 'Our mission is to provide quality educational resources and tablets to 100 underprivileged children in rural areas. These tools will enable them to access online learning materials, complete homework digitally, and develop essential digital literacy skills for the modern world.',
        goal: 10000,
        raised: 6500,
        donorCount: 42,
        status: 'active',
        createdAt: '2025-01-15',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
        milestones: [
          {
            id: 1,
            title: 'Purchase Tablets',
            description: 'Buy 100 educational tablets with protective cases',
            percentage: 40,
            status: 'completed',
            completedAt: '2025-02-01',
            proof: 'Receipt and photos uploaded'
          },
          {
            id: 2,
            title: 'Software & Content',
            description: 'Install educational software and download learning materials',
            percentage: 30,
            status: 'in-progress',
            completedAt: null,
            proof: null
          },
          {
            id: 3,
            title: 'Distribution & Training',
            description: 'Distribute tablets to children and provide usage training',
            percentage: 30,
            status: 'pending',
            completedAt: null,
            proof: null
          }
        ],
        recentDonations: [
          { donor: 'GABC...XYZ1', amount: 500, date: '2025-02-20' },
          { donor: 'GDEF...XYZ2', amount: 250, date: '2025-02-19' },
          { donor: 'GHIJ...XYZ3', amount: 1000, date: '2025-02-18' },
        ]
      }
      setCampaign(mockCampaign)
      setLoading(false)
    }, 1000)
  }, [id])

  const handleDonate = async () => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount')
      return
    }

    try {
      const amount = parseFloat(donationAmount)
      console.log('Donating:', amount, 'XLM to campaign', id)

      // Stellar Testnet configuration
      const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org')
      const networkPassphrase = StellarSdk.Networks.TESTNET

      // Load source account
      const sourceAccount = await server.loadAccount(walletAddress)
      
      // For demo: Create a claimable balance instead of direct payment
      // This way we don't need a valid destination address
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: '10000', // Higher fee for complex operation
        networkPassphrase,
      })
        .addOperation(
          StellarSdk.Operation.createClaimableBalance({
            asset: StellarSdk.Asset.native(),
            amount: amount.toString(),
            claimants: [
              new StellarSdk.Claimant(
                walletAddress, // You can claim it back (demo)
                StellarSdk.Claimant.predicateUnconditional()
              ),
            ],
          })
        )
        .addMemo(StellarSdk.Memo.text(`Donate:${id}`))
        .setTimeout(180)
        .build()

      // Sign with Freighter
      const signedTx = await signTransaction(transaction.toXDR(), {
        networkPassphrase,
      })

      if (signedTx.error) {
        throw new Error(signedTx.error)
      }

      // Submit transaction
      const txResult = await server.submitTransaction(
        StellarSdk.TransactionBuilder.fromXDR(signedTx.signedTxXdr, networkPassphrase)
      )

      console.log('Transaction successful:', txResult)
      alert(`Successfully donated ${donationAmount} XLM! \n\nTransaction: ${txResult.hash.substring(0, 16)}...\n\nYou will receive an NFT certificate soon!`)
      setShowDonationModal(false)
      setDonationAmount('')
      
      // Update campaign data without refresh
      setCampaign(prev => ({
        ...prev,
        raised: prev.raised + amount,
        donorCount: prev.donorCount + 1
      }))
    } catch (error) {
      console.error('Donation failed:', error)
      const errorMsg = error.response?.data?.extras?.result_codes || error.message || 'Unknown error'
      alert('Donation failed: ' + JSON.stringify(errorMsg))
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-stellar-purple"></div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Campaign not found</p>
        <button onClick={() => navigate('/campaigns')} className="btn-primary mt-4">
          Back to Campaigns
        </button>
      </div>
    )
  }

  const progressPercentage = (campaign.raised / campaign.goal) * 100

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/campaigns')}
        className="flex items-center text-gray-600 hover:text-stellar-purple mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Campaigns
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <div className="rounded-2xl overflow-hidden">
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Campaign Info */}
          <div className="card">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
              <p className="text-lg text-stellar-purple font-medium">{campaign.organization}</p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">{campaign.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-stellar-purple">
                  {campaign.raised.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">XLM Raised</div>
              </div>
              <div className="text-center border-l border-gray-200">
                <div className="text-2xl font-bold text-stellar-purple">{campaign.donorCount}</div>
                <div className="text-sm text-gray-600">Donors</div>
              </div>
              <div className="text-center border-l border-gray-200">
                <div className="text-2xl font-bold text-stellar-purple">
                  {Math.round(progressPercentage)}%
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">Campaign Milestones</h2>
            <div className="space-y-4">
              {campaign.milestones.map((milestone, index) => (
                <MilestoneCard key={milestone.id} milestone={milestone} index={index} />
              ))}
            </div>
          </div>

          {/* Recent Donations */}
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">Recent Donations</h2>
            <div className="space-y-3">
              {campaign.recentDonations.map((donation, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 text-stellar-purple mr-3 fill-stellar-purple" />
                    <span className="font-mono text-sm">{donation.donor}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-stellar-purple">
                      {donation.amount} XLM
                    </div>
                    <div className="text-xs text-gray-500">{donation.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {campaign.raised.toLocaleString()} XLM
              </div>
              <div className="text-gray-600">
                raised of {campaign.goal.toLocaleString()} XLM goal
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                <div
                  className="bg-stellar-purple h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setShowDonationModal(true)}
              className="btn-primary w-full mb-4"
            >
              Donate Now
            </button>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-center text-gray-700">
                <Users className="w-5 h-5 mr-3 text-stellar-purple" />
                <span className="text-sm">{campaign.donorCount} donors</span>
              </div>
              <div className="flex items-center text-gray-700">
                <TrendingUp className="w-5 h-5 mr-3 text-stellar-purple" />
                <span className="text-sm">{Math.round(progressPercentage)}% funded</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle className="w-5 h-5 mr-3 text-stellar-purple" />
                <span className="text-sm">
                  {campaign.milestones.filter(m => m.status === 'completed').length}/
                  {campaign.milestones.length} milestones
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Why Donate?</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ 100% transparent tracking</li>
                <li>✓ Milestone-based fund release</li>
                <li>✓ Receive NFT certificate</li>
                <li>✓ Vote on fund usage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Make a Donation</h2>
            <p className="text-gray-600 mb-6">
              Support {campaign.title} and receive an NFT certificate
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount (XLM)
              </label>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="100"
                min="1"
                className="input-field"
                autoFocus
              />
              <div className="flex gap-2 mt-3">
                {[50, 100, 250, 500].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount.toString())}
                    className="flex-1 py-2 border border-gray-300 rounded-lg hover:border-stellar-purple hover:text-stellar-purple transition text-sm"
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDonationModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button onClick={handleDonate} className="btn-primary flex-1">
                {isConnected ? 'Donate' : 'Connect & Donate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MilestoneCard({ milestone, index }) {
  const statusConfig = {
    completed: {
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-50',
      label: 'Completed'
    },
    'in-progress': {
      icon: Clock,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      label: 'In Progress'
    },
    pending: {
      icon: Clock,
      color: 'text-gray-400',
      bg: 'bg-gray-50',
      label: 'Pending'
    }
  }

  const config = statusConfig[milestone.status]
  const Icon = config.icon

  return (
    <div className={`p-4 rounded-lg border-2 ${milestone.status === 'completed' ? 'border-green-200' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center mr-3`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Milestone {index + 1}: {milestone.title}
            </h3>
            <span className={`text-xs ${config.color} font-medium`}>{config.label}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-stellar-purple">
            {milestone.percentage}%
          </div>
          <div className="text-xs text-gray-500">of funds</div>
        </div>
      </div>
      <p className="text-sm text-gray-600 ml-11">{milestone.description}</p>
      {milestone.proof && (
        <p className="text-xs text-green-600 ml-11 mt-2">✓ {milestone.proof}</p>
      )}
    </div>
  )
}
