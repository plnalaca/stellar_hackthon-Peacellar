import { Link } from 'react-router-dom'
import { ArrowRight, Shield, TrendingUp, Award, Users, Sparkles, Heart, Lock, Check } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'

export default function Home() {
  const { resetTutorial } = useWallet()
  
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="text-center py-20 fade-in">
        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/30">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="text-white font-medium">Powered by Stellar Blockchain</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight">
          Transparent
          <br />
          Donations
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
          Track every donation, verify every milestone, and ensure your generosity creates 
          <span className="font-bold text-white"> real impact</span> on the blockchain.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link to="/campaigns" className="btn-primary inline-flex items-center justify-center text-lg px-8 py-4 group">
            <span>Explore Campaigns</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/create-campaign" className="btn-secondary inline-flex items-center justify-center text-lg px-8 py-4">
            <Sparkles className="mr-2 w-5 h-5" />
            <span>Start a Campaign</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20">
          <div className="text-center">
            <div className="text-5xl font-black text-white mb-2">$0</div>
            <div className="text-white/70 font-medium">Total Donated</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-white mb-2">0</div>
            <div className="text-white/70 font-medium">Active Campaigns</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-white mb-2">100%</div>
            <div className="text-white/70 font-medium">Transparent</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={<Shield className="w-8 h-8" />}
          title="Blockchain Security"
          description="All donations secured by Stellar smart contracts"
          gradient="from-blue-500 to-cyan-500"
        />
        <FeatureCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="Milestone Tracking"
          description="Funds released when milestones are achieved"
          gradient="from-purple-500 to-pink-500"
        />
        <FeatureCard
          icon={<Award className="w-8 h-8" />}
          title="NFT Certificates"
          description="Get unique NFT for every donation made"
          gradient="from-amber-500 to-orange-500"
        />
        <FeatureCard
          icon={<Users className="w-8 h-8" />}
          title="Community Votes"
          description="Donors vote on fund releases together"
          gradient="from-green-500 to-emerald-500"
        />
      </section>

      {/* How It Works */}
      <section className="card glass backdrop-blur-xl border-2 border-white/30 p-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-700 text-lg">Simple, transparent, and secure</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <StepCard
            number="1"
            icon={<Heart className="w-10 h-10" />}
            title="Create or Browse"
            description="Organizations create campaigns. Donors choose causes they care about."
          />
          <StepCard
            number="2"
            icon={<Lock className="w-10 h-10" />}
            title="Donate Securely"
            description="Make donations with passkey authentication. Get instant NFT certificate."
          />
          <StepCard
            number="3"
            icon={<Check className="w-10 h-10" />}
            title="Track Impact"
            description="Monitor fund usage in real-time. Vote on milestones and see your impact."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-3xl p-16 text-center glass backdrop-blur-xl border-2 border-white/30">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-pink-300/20"></div>
        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Ready to Make a<br />
            <span className="text-white">Difference?</span>
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join the future of transparent charitable giving on the Stellar blockchain
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/campaigns" className="btn-primary text-lg px-10 py-5 inline-flex items-center group">
              <span>Get Started Now</span>
              <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>
            <button 
              onClick={resetTutorial}
              className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition backdrop-blur-sm border border-white/30 text-lg font-medium inline-flex items-center group"
            >
              <span>📚 How to Use</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description, gradient }) {
  return (
    <div className="card glass backdrop-blur-xl border-2 border-white/30 hover:scale-105 transition-transform duration-300 group">
      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl mb-4 shadow-lg group-hover:shadow-2xl transition-shadow`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({ number, icon, title, description }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
      <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200 hover:border-gray-300 transition-all">
        <div className="flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full mb-6 mx-auto">
          <div className="text-white">
            {icon}
          </div>
        </div>
        <div className="text-4xl font-black text-gray-300 mb-4 text-center">{number}</div>
        <h3 className="text-2xl font-bold mb-3 text-gray-900 text-center">{title}</h3>
        <p className="text-gray-700 text-center leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
