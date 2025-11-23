import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../contexts/WalletContext'
import { Plus, X, Upload } from 'lucide-react'
import * as StellarSdk from '@stellar/stellar-sdk'
import { signTransaction } from '@stellar/freighter-api'

export default function CreateCampaign() {
  const { isConnected, connectWallet, walletAddress } = useWallet()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    description: '',
    goal: '',
    image: null,
  })

  const [milestones, setMilestones] = useState([
    { id: 1, title: '', description: '', percentage: '' }
  ])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMilestoneChange = (id, field, value) => {
    setMilestones(prev =>
      prev.map(m => m.id === id ? { ...m, [field]: value } : m)
    )
  }

  const addMilestone = () => {
    const newId = Math.max(...milestones.map(m => m.id), 0) + 1
    setMilestones(prev => [...prev, { id: newId, title: '', description: '', percentage: '' }])
  }

  const removeMilestone = (id) => {
    if (milestones.length > 1) {
      setMilestones(prev => prev.filter(m => m.id !== id))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    // Validate milestones
    const totalPercentage = milestones.reduce((sum, m) => sum + (parseFloat(m.percentage) || 0), 0)
    if (Math.abs(totalPercentage - 100) > 0.01) {
      alert('Milestone percentages must sum to 100%')
      return
    }

    setLoading(true)

    try {
      console.log('Creating campaign:', formData, milestones)

      // For now, just store campaign data locally
      // TODO: Implement full Soroban contract integration
      const campaignData = {
        id: Date.now(),
        creator: walletAddress,
        title: formData.title,
        organization: formData.organization,
        description: formData.description,
        goal: parseFloat(formData.goal),
        milestones: milestones.map(m => ({
          id: m.id,
          title: m.title,
          description: m.description,
          percentage: parseFloat(m.percentage),
        })),
        createdAt: new Date().toISOString(),
      }

      // Store in localStorage for demo
      const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]')
      existingCampaigns.push(campaignData)
      localStorage.setItem('campaigns', JSON.stringify(existingCampaigns))

      console.log('Campaign stored:', campaignData)
      alert(`Campaign "${formData.title}" created successfully!\n\nCampaign ID: ${campaignData.id}\n\nYour campaign is now live!`)
      navigate('/campaigns')
    } catch (error) {
      console.error('Failed to create campaign:', error)
      alert('Failed to create campaign: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            You need to connect your wallet to create a campaign
          </p>
          <button onClick={connectWallet} className="btn-primary">
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-2">Create Campaign</h1>
      <p className="text-white/80 mb-8">
        Launch a transparent fundraising campaign on the blockchain
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Education for 100 Children"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                placeholder="e.g., Education Foundation"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your campaign goals and impact..."
                className="input-field"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Goal (XLM) *
              </label>
              <input
                type="number"
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                placeholder="10000"
                min="1"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-stellar-purple transition cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Milestones</h2>
            <button
              type="button"
              onClick={addMilestone}
              className="btn-secondary text-sm py-2 px-4"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Add Milestone
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Define milestones for your campaign. Funds will be released as each milestone is completed and approved.
            Total percentages must equal 100%.
          </p>

          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900">Milestone {index + 1}</h3>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(milestone.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => handleMilestoneChange(milestone.id, 'title', e.target.value)}
                    placeholder="Milestone title"
                    className="input-field"
                    required
                  />
                  <textarea
                    value={milestone.description}
                    onChange={(e) => handleMilestoneChange(milestone.id, 'description', e.target.value)}
                    placeholder="Describe what needs to be accomplished"
                    className="input-field"
                    rows="2"
                    required
                  />
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Fund Release Percentage (%)
                    </label>
                    <input
                      type="number"
                      value={milestone.percentage}
                      onChange={(e) => handleMilestoneChange(milestone.id, 'percentage', e.target.value)}
                      placeholder="25"
                      min="0"
                      max="100"
                      step="0.01"
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              Total: {milestones.reduce((sum, m) => sum + (parseFloat(m.percentage) || 0), 0).toFixed(2)}%
              {Math.abs(milestones.reduce((sum, m) => sum + (parseFloat(m.percentage) || 0), 0) - 100) > 0.01 && (
                <span className="text-red-500 ml-2">(Must equal 100%)</span>
              )}
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/campaigns')}
            className="btn-secondary flex-1"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={loading}
          >
            {loading ? 'Creating Campaign...' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  )
}
