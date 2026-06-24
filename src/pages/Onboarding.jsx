import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Heart, 
  Bell, 
  Shield, 
  Rocket,
  User,
  Briefcase,
  MapPin,
  GraduationCap
} from 'lucide-react'
import { useOnboarding } from '../context/OnboardingContext'
import { onboardingInterests, states } from '../utils/mockData'

function Onboarding({ onComplete }) {
  const {
    currentStep,
    totalSteps,
    selectedInterests,
    preferredStates,
    notificationPreference,
    nextStep,
    prevStep,
    toggleInterest,
    toggleState,
    toggleNotificationPref
  } = useOnboarding()

  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Auto-scroll to top on step change
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    nextStep()
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    prevStep()
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleComplete = () => {
    onComplete()
  }

  // Step components
  const renderStepIndicator = () => (
    <div className="flex justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <motion.div
          key={index}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === currentStep 
              ? 'bg-luxury-gold w-6' 
              : index < currentStep 
                ? 'bg-luxury-gold/50' 
                : 'bg-white/20'
          }`}
          animate={index === currentStep ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5 }}
        />
      ))}
    </div>
  )

  const renderWelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      {/* Logo */}
      <motion.div
        className="relative w-24 h-24 mx-auto mb-8"
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-3xl opacity-80 blur-xl" />
        <div className="absolute inset-4 bg-luxury-deep rounded-2xl flex items-center justify-center">
          <span className="text-2xl font-bold text-luxury-gold">GR</span>
        </div>
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-luxury-gold rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </motion.div>

      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Welcome to <span className="text-gradient">GovtRank</span> Luxury
      </motion.h1>

      <motion.p
        className="text-gray-300 text-lg mb-8 max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Your premium gateway to government job opportunities across India. 
        Let's get started with a personalized experience.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button onClick={handleNext} className="btn-gold flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  )

  const renderInterestsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        className="w-16 h-16 bg-luxury-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
        initial={{ scale: 0.5, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heart className="w-8 h-8 text-luxury-gold" />
      </motion.div>

      <motion.h2
        className="text-3xl font-bold text-white mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        What Are You Interested In?
      </motion.h2>

      <motion.p
        className="text-gray-400 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Select the job categories that interest you the most
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8"
      >
        {onboardingInterests.map((interest) => {
          const isSelected = selectedInterests.includes(interest.id)
          return (
            <motion.button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
                isSelected
                  ? 'bg-luxury-gold text-luxury-deep shadow-glow-gold'
                  : 'bg-white/5 text-gray-300 border border-white/10 hover:border-luxury-gold/20'
              }`}
              animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.2 }}
            >
              <span className={`text-lg ${isSelected ? 'text-luxury-deep' : 'text-gray-400'}`}>
                {getInterestIcon(interest.id)}
              </span>
              <span className="font-medium">{interest.name}</span>
            </motion.button>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-between items-center"
      >
        <button onClick={handlePrev} className="btn-gold-outline flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button 
          onClick={handleNext}
          disabled={selectedInterests.length === 0}
          className="btn-gold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  )

  const renderLocationStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        className="w-16 h-16 bg-luxury-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
        initial={{ scale: 0.5, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5 }}
      >
        <MapPin className="w-8 h-8 text-luxury-gold" />
      </motion.div>

      <motion.h2
        className="text-3xl font-bold text-white mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Where Do You Want to Work?
      </motion.h2>

      <motion.p
        className="text-gray-400 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Select the states where you're looking for job opportunities
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8"
      >
        {states.slice(0, 12).map((state) => {
          const isSelected = preferredStates.includes(state)
          return (
            <motion.button
              key={state}
              onClick={() => toggleState(state)}
              whileTap={{ scale: 0.95 }}
              className={`py-3 px-4 rounded-xl transition-all text-sm ${
                isSelected
                  ? 'bg-luxury-gold text-luxury-deep shadow-glow-gold'
                  : 'bg-white/5 text-gray-300 border border-white/10 hover:border-luxury-gold/20'
              }`}
              animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.2 }}
            >
              <span className="font-medium">{state}</span>
            </motion.button>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-between items-center"
      >
        <button onClick={handlePrev} className="btn-gold-outline flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button 
          onClick={handleNext}
          disabled={preferredStates.length === 0}
          className="btn-gold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  )

  const renderNotificationsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        className="w-16 h-16 bg-luxury-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
        initial={{ scale: 0.5, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Bell className="w-8 h-8 text-luxury-gold" />
      </motion.div>

      <motion.h2
        className="text-3xl font-bold text-white mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Stay Updated with Notifications
      </motion.h2>

      <motion.p
        className="text-gray-400 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Get instant alerts for new job postings, exam dates, and results
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 max-w-md mx-auto mb-8"
      >
        <button
          onClick={toggleNotificationPref}
          className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
            notificationPreference
              ? 'bg-luxury-gold/10 border border-luxury-gold/20'
              : 'bg-white/5 border border-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-luxury-gold" />
            <span className="text-left">Enable Push Notifications</span>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            notificationPreference
              ? 'border-luxury-gold bg-luxury-gold'
              : 'border-gray-500 bg-transparent'
          }`}>
            {notificationPreference && <Check className="w-4 h-4 text-luxury-deep" />}
          </div>
        </button>

        <div className="luxury-card text-left p-4">
          <p className="text-sm text-gray-400 mb-2">You'll receive:</p>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-luxury-gold rounded-full" />
              <span>New job postings matching your interests</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-luxury-gold rounded-full" />
              <span>Exam date reminders</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-luxury-gold rounded-full" />
              <span>Result announcements</span>
            </li>
          </ul>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-between items-center"
      >
        <button onClick={handlePrev} className="btn-gold-outline flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button onClick={handleNext} className="btn-gold flex items-center gap-2">
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  )

  const renderCompleteStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        className="relative w-24 h-24 mx-auto mb-8"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-3xl opacity-80" />
        <div className="absolute inset-4 bg-luxury-deep rounded-2xl flex items-center justify-center">
          <Check className="w-12 h-12 text-luxury-gold" />
        </div>
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-luxury-gold rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${10 + (i % 4) * 15}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 2 + i * 0.2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </motion.div>

      <motion.h2
        className="text-3xl font-bold text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        You're All Set! 
        <span role="img" aria-label="celebrate">🎉</span>
      </motion.h2>

      <motion.p
        className="text-gray-300 mb-8 max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Your GovtRank Luxury experience is ready. We've personalized your 
        dashboard based on your preferences.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        {/* Summary */}
        <div className="luxury-card text-left p-4 max-w-md mx-auto">
          <h3 className="font-semibold text-white mb-3">Your Preferences:</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-luxury-gold" />
              <span className="text-sm text-gray-300">{selectedInterests.length} interests selected</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-luxury-gold" />
              <span className="text-sm text-gray-300">{preferredStates.length} states preferred</span>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-luxury-gold" />
              <span className="text-sm text-gray-300">{notificationPreference ? 'Notifications enabled' : 'Notifications disabled'}</span>
            </div>
          </div>
        </div>

        <button onClick={handleComplete} className="btn-gold flex items-center justify-center gap-2 w-full max-w-md mx-auto">
          <Rocket className="w-5 h-5" />
          <span>Launch My Experience</span>
        </button>
      </motion.div>
    </motion.div>
  )

  // Helper function for interest icons
  const getInterestIcon = (id) => {
    const icons = {
      banking: '₹',
      medical: '⚕',
      engineering: '⚙',
      defense: '🛡',
      railway: '🚂',
      teaching: '📚',
      psu: '🏢',
      'state-govt': '🗺',
      'central-govt': '🇮🇳',
    }
    return icons[id] || '✨'
  }

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderWelcomeStep()
      case 1:
        return renderInterestsStep()
      case 2:
        return renderLocationStep()
      case 3:
        return renderNotificationsStep()
      case 4:
        return renderCompleteStep()
      default:
        return renderWelcomeStep()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-luxury flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-xl flex items-center justify-center">
              <span className="text-luxury-deep font-bold">GR</span>
            </div>
            <span className="text-xl font-bold text-white">GovtRank Luxury</span>
          </div>
          
          {currentStep > 0 && (
            <button
              onClick={handleComplete}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Skip
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          {renderStepIndicator()}
          <AnimatePresence mode="wait">
            {renderCurrentStep()}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-xs text-gray-500">
          Step {currentStep + 1} of {totalSteps}
        </p>
      </footer>
    </div>
  )
}

export default Onboarding
