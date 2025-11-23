import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, TrendingUp } from 'lucide-react'

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = () => {
    setLoading(true)
    
    // Load campaigns from localStorage
    const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]')
    
    // Convert saved campaigns to display format
    const userCampaigns = savedCampaigns.map(camp => ({
      id: camp.id.toString(),
      title: camp.title,
      organization: camp.organization,
      description: camp.description,
      goal: camp.goal,
      raised: 0, // Will be updated from donations
      milestones: camp.milestones?.length || 0,
      milestonesCompleted: 0,
      status: 'active',
      image: camp.image || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400',
      creator: camp.creator
    }))

    // Mock campaigns
    const mockCampaigns = [
      {
        id: '1',
        title: 'Education for 100 Children',
        organization: 'Education Foundation',
        description: 'Provide tablets and educational resources for underprivileged children',
        goal: 10000,
        raised: 6500,
        milestones: 3,
        milestonesCompleted: 1,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
      },
      {
        id: '2',
        title: 'Clean Water Initiative',
        organization: 'WaterAid',
        description: 'Build water wells in rural communities',
        goal: 25000,
        raised: 18750,
        milestones: 5,
        milestonesCompleted: 3,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1541844053589-346841d0b34c?w=400',
      },
      {
        id: '3',
        title: 'Medical Supplies Fund',
        organization: 'Health Heroes',
        description: 'Emergency medical supplies for disaster relief',
        goal: 15000,
        raised: 15000,
        milestones: 4,
        milestonesCompleted: 4,
        status: 'completed',
        image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400',
      },
    ]
    
    // Combine user campaigns with mock campaigns
    const allCampaigns = [...userCampaigns, ...mockCampaigns]
    setCampaigns(allCampaigns)
    setLoading(false)
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.organization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || campaign.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Active Campaigns</h1>
          <p className="text-white/80">Support transparent and verified charitable projects</p>
        </div>
        <Link to="/create-campaign" className="btn-primary">
          Create Campaign
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '3rem' }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-500 w-5 h-5" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">All Campaigns</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-stellar-purple"></div>
          <p className="mt-4 text-gray-600">Loading campaigns...</p>
        </div>
      ) : filteredCampaigns.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-600">No campaigns found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  )
}

function CampaignCard({ campaign }) {
  const progressPercentage = (campaign.raised / campaign.goal) * 100

  return (
    <Link to={`/campaigns/${campaign.id}`} className="card glass backdrop-blur-xl border-2 border-white/30 hover:scale-105 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
      <div className="relative mb-4 rounded-xl overflow-hidden h-48">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {campaign.status === 'completed' && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
            ✓ Completed
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{campaign.title}</h3>
          <p className="text-sm text-white/90 font-medium">{campaign.organization}</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">{campaign.description}</p>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-bold text-gray-900">{campaign.raised.toLocaleString()} XLM</span>
            <span className="text-gray-600">Goal: {campaign.goal.toLocaleString()} XLM</span>
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-gray-600 text-sm font-medium">
            {campaign.milestonesCompleted}/{campaign.milestones} Milestones
          </span>
          <div className="flex items-center text-green-600 font-bold">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>{Math.round(progressPercentage)}%</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
