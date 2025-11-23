import { useState, useEffect } from 'react'
import { X, ArrowRight, Wallet, Heart, TrendingUp, Award } from 'lucide-react'

export default function OnboardingTutorial({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has seen tutorial before
    const hasSeenTutorial = localStorage.getItem('peacellar_tutorial_completed')
    if (!hasSeenTutorial) {
      setIsVisible(true)
    }
  }, [])

  const steps = [
    {
      icon: <Heart className="w-12 h-12 text-red-500 fill-red-500" />,
      title: "Welcome to Peacellar! 🌟",
      description: "A transparent donation platform powered by Stellar blockchain. Every donation is tracked, verified, and visible on the blockchain.",
      highlight: "Let's get you started in just 3 steps!"
    },
    {
      icon: <Wallet className="w-12 h-12 text-blue-500" />,
      title: "Connect Your Wallet",
      description: "First, you'll need a Freighter wallet to donate or create campaigns. It's free, secure, and takes just 2 minutes to set up.",
      highlight: "Don't have one? We'll help you install it!",
      action: "Install Freighter",
      actionLink: "https://www.freighter.app/"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-green-500" />,
      title: "Explore Campaigns",
      description: "Browse active campaigns, see real-time donation progress, and choose causes that matter to you. Every campaign has transparent milestones.",
      highlight: "100% transparent, 100% on-chain"
    },
    {
      icon: <Award className="w-12 h-12 text-purple-500" />,
      title: "Make an Impact",
      description: "Donate with XLM and track your impact in real-time. Create your own campaigns, or earn NFT certificates for your contributions.",
      highlight: "Ready to change the world? Let's go!"
    }
  ]

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('peacellar_tutorial_completed', 'true')
    if (onComplete) onComplete()
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleClose()
  }

  if (!isVisible) return null

  const step = steps[currentStep]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 relative">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-full mb-4">
              {step.icon}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            {step.title}
          </h2>
          <p className="text-lg text-gray-600 mb-6 text-center leading-relaxed">
            {step.description}
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl text-center">
            <p className="text-purple-700 font-semibold">
              {step.highlight}
            </p>
          </div>

          {/* Optional Action Button */}
          {step.action && step.actionLink && (
            <div className="mt-6 text-center">
              <a
                href={step.actionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {step.action}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-8 mb-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-purple-600 w-8'
                    : index < currentStep
                    ? 'bg-purple-300'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition font-medium"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition font-medium flex items-center justify-center gap-2"
            >
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Skip Button */}
          <div className="text-center mt-4">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Skip tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
