import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../contexts/WalletContext'
import { TrendingUp, Heart, Award, Calendar, Edit, Trash2, Eye } from 'lucide-react'
import * as StellarSdk from '@stellar/stellar-sdk'

export default function Dashboard() {
  const { isConnected, walletAddress, connectWallet } = useWallet()
  const navigate = useNavigate()
  const [userStats, setUserStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [viewingCampaignStats, setViewingCampaignStats] = useState(null)

  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchUserDonations()
    }
  }, [isConnected, walletAddress])

  const handleDeleteCampaign = (campaignId) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return
    
    const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]')
    const updatedCampaigns = savedCampaigns.filter(c => c.id !== campaignId)
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns))
    
    // Refresh data
    fetchUserDonations()
    alert('Campaign deleted successfully!')
  }

  const handleUpdateCampaign = (updatedData) => {
    const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]')
    const updatedCampaigns = savedCampaigns.map(c => 
      c.id === updatedData.id ? { ...c, ...updatedData } : c
    )
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns))
    
    setEditingCampaign(null)
    fetchUserDonations()
    alert('Campaign updated successfully!')
  }

  const fetchUserDonations = async () => {
    try {
      setLoading(true)
      console.log('Fetching donations for:', walletAddress)
      
      const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org')
      
      // Fetch account operations to get all transactions
      const operations = await server
        .operations()
        .forAccount(walletAddress)
        .order('desc')
        .limit(100)
        .call()

      console.log('Found operations:', operations.records.length)

      // Filter donations (claimable balance creations with memo)
      const donations = []
      let totalDonated = 0
      const campaigns = new Set()

      for (const operation of operations.records) {
        if (operation.type === 'create_claimable_balance' && operation.source_account === walletAddress) {
          try {
            // Fetch the transaction to get memo
            const txResponse = await server.transactions().transaction(operation.transaction_hash).call()
            const memo = txResponse.memo
            
            console.log('Found claimable balance:', {
              amount: operation.amount,
              memo: memo,
              hash: operation.transaction_hash
            })
            
            if (memo && (memo.startsWith('Donate:') || memo.includes('Donation'))) {
              const campaignId = memo.includes(':') ? memo.split(':')[1] : '1'
              const amount = parseFloat(operation.amount)
              
              donations.push({
                id: operation.id,
                campaign: `Campaign #${campaignId}`,
                amount: amount,
                date: new Date(operation.created_at).toLocaleDateString(),
                nftId: `NFT-${operation.transaction_hash.substring(0, 8)}`,
                txHash: operation.transaction_hash
              })
              
              totalDonated += amount
              campaigns.add(campaignId)
            }
          } catch (txError) {
            console.error('Error fetching transaction:', txError)
          }
        }
      }

      console.log('Total donations found:', donations.length)
      console.log('Total donated:', totalDonated)

      // Load user's created campaigns from localStorage
      const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]')
      const userCampaigns = savedCampaigns
        .filter(camp => camp.creator === walletAddress)
        .map(camp => ({
          id: camp.id,
          title: camp.title,
          organization: camp.organization,
          description: camp.description,
          goal: camp.goal,
          raised: 0, // TODO: Calculate from donations
          status: 'active',
          createdAt: camp.createdAt,
          milestones: camp.milestones || []
        }))

      setUserStats({
        totalDonated: totalDonated.toFixed(2),
        campaignsSupported: campaigns.size || (donations.length > 0 ? 1 : 0),
        nftCertificates: donations.length,
        impactScore: Math.min(100, donations.length * 20),
        donations: donations,
        myCampaigns: userCampaigns
      })
      setLoading(false)
    } catch (error) {
      console.error('Error fetching donations:', error)
      alert('Bağış geçmişi yüklenemedi. Lütfen sayfayı yenileyin.')
      // Set empty stats
      setUserStats({
        totalDonated: 0,
        campaignsSupported: 0,
        nftCertificates: 0,
        impactScore: 0,
        donations: [],
        myCampaigns: []
      })
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to view your dashboard and donation history
          </p>
          <button onClick={connectWallet} className="btn-primary">
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-stellar-purple"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
          <p className="text-white/80">Track your donations and impact</p>
        </div>
        <button 
          onClick={fetchUserDonations}
          disabled={loading}
          className="btn-secondary flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Loading...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Total Donated"
          value={`${userStats.totalDonated} XLM`}
          color="purple"
        />
        <StatCard
          icon={<Heart className="w-6 h-6" />}
          label="Campaigns Supported"
          value={userStats.campaignsSupported}
          color="blue"
        />
        <StatCard
          icon={<Award className="w-6 h-6" />}
          label="NFT Certificates"
          value={userStats.nftCertificates}
          color="green"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Impact Score"
          value={userStats.impactScore}
          color="orange"
        />
      </div>

      {/* Campaign Progress Chart */}
      {userStats.myCampaigns && userStats.myCampaigns.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">My Campaigns Progress</h3>
          <div className="space-y-4">
            {userStats.myCampaigns.map(campaign => (
              <CampaignProgressBar key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      )}

      {/* Donation History */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6">Donation History</h2>
        <div className="space-y-3">
          {userStats.donations.map(donation => (
            <div
              key={donation.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-start md:items-center mb-3 md:mb-0">
                <div className="w-10 h-10 bg-stellar-purple/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Heart className="w-5 h-5 text-stellar-purple fill-stellar-purple" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{donation.campaign}</h3>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {donation.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-4 ml-14 md:ml-0">
                <div className="text-right">
                  <div className="font-bold text-stellar-purple">{donation.amount} XLM</div>
                  <div className="text-xs text-gray-500">{donation.nftId}</div>
                </div>
                <button className="btn-secondary text-sm py-1 px-3">
                  View NFT
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Campaigns (if user has created any) */}
      {userStats.myCampaigns && userStats.myCampaigns.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">My Campaigns</h2>
            <button 
              onClick={() => navigate('/create')}
              className="btn-primary text-sm py-2 px-4"
            >
              + Create New
            </button>
          </div>
          <div className="space-y-3">
            {userStats.myCampaigns.map(campaign => {
              const progress = (campaign.raised / campaign.goal) * 100
              return (
                <div key={campaign.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
                      <p className="text-sm text-gray-600">{campaign.organization}</p>
                      <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setViewingCampaignStats(campaign)}
                        className="p-2 text-stellar-purple hover:bg-purple-50 rounded-lg transition"
                        title="View Stats"
                      >
                        📊
                      </button>
                      <button 
                        onClick={() => navigate(`/campaigns/${campaign.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View Campaign"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setEditingCampaign(campaign)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        title="Edit Campaign"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold">{campaign.raised} XLM</span>
                      <span className="text-gray-600">of {campaign.goal} XLM</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-stellar-purple h-2 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* NFT Gallery Preview */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My NFT Certificates</h2>
          <button className="text-stellar-purple hover:underline text-sm font-medium">
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center hover:scale-105 transition cursor-pointer"
            >
              <Award className="w-12 h-12 text-stellar-purple" />
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Stats Modal */}
      {viewingCampaignStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold">{viewingCampaignStats.title}</h2>
                <p className="text-gray-600 mt-1">{viewingCampaignStats.organization}</p>
              </div>
              <button 
                onClick={() => setViewingCampaignStats(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-stellar-purple">
                  {viewingCampaignStats.raised || 0}
                </div>
                <div className="text-sm text-gray-600">XLM Raised</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {viewingCampaignStats.goal}
                </div>
                <div className="text-sm text-gray-600">XLM Goal</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {((viewingCampaignStats.raised || 0) / viewingCampaignStats.goal * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.floor((Date.now() - new Date(viewingCampaignStats.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Campaign Progress</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <CampaignProgressBar campaign={viewingCampaignStats} />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Remaining</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {(viewingCampaignStats.goal - (viewingCampaignStats.raised || 0)).toFixed(2)} XLM
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Days Left</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ∞ <span className="text-sm text-gray-500">(no deadline)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Donations Chart */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Recent Donations</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <CampaignDonationsChart 
                  campaignId={viewingCampaignStats.id} 
                  donations={userStats.donations}
                />
              </div>
            </div>

            {/* Milestones Progress */}
            {viewingCampaignStats.milestones && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Milestones</h3>
                <div className="space-y-3">
                  {viewingCampaignStats.milestones.map((milestone, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{milestone.title}</span>
                        <span className="text-sm text-stellar-purple font-medium">
                          {milestone.percentage}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-stellar-purple h-2 rounded-full transition-all"
                          style={{ width: `${(viewingCampaignStats.raised || 0) >= (viewingCampaignStats.goal * milestone.percentage / 100) ? 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={() => setViewingCampaignStats(null)}
              className="btn-primary w-full mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Campaign Modal */}
      {editingCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Edit Campaign</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              handleUpdateCampaign({
                id: editingCampaign.id,
                title: formData.get('title'),
                organization: formData.get('organization'),
                goal: parseFloat(formData.get('goal'))
              })
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingCampaign.title}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    name="organization"
                    defaultValue={editingCampaign.organization}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal (XLM)
                  </label>
                  <input
                    type="number"
                    name="goal"
                    defaultValue={editingCampaign.goal}
                    className="input-field"
                    required
                    min="1"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingCampaign(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600'
  }

  return (
    <div className="card">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}

function DonationTrendChart({ donations }) {
  if (!donations || donations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        No donation data yet
      </div>
    )
  }

  // Group donations by date
  const donationsByDate = donations.reduce((acc, d) => {
    acc[d.date] = (acc[d.date] || 0) + d.amount
    return acc
  }, {})

  const dates = Object.keys(donationsByDate).sort()
  const maxAmount = Math.max(...Object.values(donationsByDate))

  return (
    <div className="h-full flex items-end justify-between gap-2 px-4">
      {dates.map((date, i) => {
        const amount = donationsByDate[date]
        const height = (amount / maxAmount) * 100
        return (
          <div key={date} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col items-center justify-end h-48">
              <div 
                className="w-full bg-gradient-to-t from-stellar-purple to-purple-400 rounded-t-lg transition-all duration-500 hover:opacity-80"
                style={{ height: `${height}%`, minHeight: '8px' }}
                title={`${amount} XLM`}
              />
            </div>
            <div className="text-xs text-gray-600 mt-2 text-center">
              {date.split('.')[0]}/{date.split('.')[1]}
            </div>
            <div className="text-xs font-semibold text-stellar-purple">
              {amount.toFixed(1)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ImpactScoreChart({ score, donations, campaigns }) {
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference

  return (
    <div className="relative">
      <svg width="200" height="200" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="16"
        />
        {/* Progress circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="16"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-gray-900">{score}</div>
        <div className="text-sm text-gray-600">Impact Score</div>
        <div className="mt-4 text-xs text-center">
          <div>{donations} Donations</div>
          <div>{campaigns} Campaigns</div>
        </div>
      </div>
    </div>
  )
}

function CampaignProgressBar({ campaign }) {
  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100)
  
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-gray-900">{campaign.title}</h4>
          <p className="text-sm text-gray-600">{campaign.organization}</p>
        </div>
        <span className="text-sm font-medium text-stellar-purple">
          {progress.toFixed(1)}%
        </span>
      </div>
      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-gradient-to-r from-stellar-purple to-blue-500 transition-all duration-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-2">
        <span>{campaign.raised} XLM raised</span>
        <span>{campaign.goal} XLM goal</span>
      </div>
    </div>
  )
}

function CampaignDonationsChart({ campaignId, donations }) {
  // Filter donations for this specific campaign
  const campaignDonations = donations.filter(d => {
    // Extract campaign ID from campaign name (e.g., "Campaign #1" -> "1")
    const donationCampaignId = d.campaign.includes('#') 
      ? d.campaign.split('#')[1] 
      : d.campaign
    return donationCampaignId === campaignId
  })
  
  if (campaignDonations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No donations yet for this campaign</p>
      </div>
    )
  }

  const maxAmount = Math.max(...campaignDonations.map(d => d.amount))
  
  return (
    <div>
      <div className="space-y-3">
        {campaignDonations.slice(0, 5).map((donation, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="text-sm text-gray-600 w-24">
              {donation.date}
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-8">
                <div 
                  className="bg-gradient-to-r from-stellar-purple to-blue-500 h-8 rounded-full transition-all flex items-center justify-end pr-3"
                  style={{ width: `${(donation.amount / maxAmount) * 100}%`, minWidth: '60px' }}
                >
                  <span className="text-xs text-white font-semibold">
                    {donation.amount} XLM
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {campaignDonations.length > 5 && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          Showing 5 of {campaignDonations.length} donations
        </p>
      )}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-stellar-purple">
              {campaignDonations.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Raised</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {campaignDonations.length}
            </div>
            <div className="text-sm text-gray-600">Donors</div>
          </div>
        </div>
      </div>
    </div>
  )
}
