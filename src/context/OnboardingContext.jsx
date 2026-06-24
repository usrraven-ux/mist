import React, { createContext, useContext, useState } from 'react'

const OnboardingContext = createContext()

export function OnboardingProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedInterests, setSelectedInterests] = useState([])
  const [preferredStates, setPreferredStates] = useState([])
  const [notificationPreference, setNotificationPreference] = useState(true)

  const totalSteps = 4

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const toggleInterest = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const toggleState = (state) => {
    setPreferredStates(prev => 
      prev.includes(state)
        ? prev.filter(s => s !== state)
        : [...prev, state]
    )
  }

  const toggleNotificationPref = () => {
    setNotificationPreference(prev => !prev)
  }

  const resetOnboarding = () => {
    setCurrentStep(0)
    setSelectedInterests([])
    setPreferredStates([])
    setNotificationPreference(true)
  }

  const value = {
    currentStep,
    totalSteps,
    selectedInterests,
    preferredStates,
    notificationPreference,
    nextStep,
    prevStep,
    toggleInterest,
    toggleState,
    toggleNotificationPref,
    resetOnboarding,
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within a OnboardingProvider')
  }
  return context
}
