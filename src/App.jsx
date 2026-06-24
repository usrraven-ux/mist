import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { JobProvider } from './context/JobContext'
import { NotificationProvider } from './context/NotificationContext'
import { OnboardingProvider } from './context/OnboardingContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import StateJobs from './pages/StateJobs'
import CategoryJobs from './pages/CategoryJobs'
import QualificationJobs from './pages/QualificationJobs'
import Notification from './pages/Notification'
import SavedJobs from './pages/SavedJobs'
import Profile from './pages/Profile'
import Onboarding from './pages/Onboarding'
import SearchResults from './pages/SearchResults'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Check if user is new for onboarding
      const isNewUser = !localStorage.getItem('govtrank_onboarded')
      if (isNewUser) {
        setShowOnboarding(true)
      }
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem('govtrank_onboarded', 'true')
    setShowOnboarding(false)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (showOnboarding) {
    return (
      <OnboardingProvider>
        <Onboarding onComplete={handleOnboardingComplete} />
      </OnboardingProvider>
    )
  }

  return (
    <JobProvider>
      <NotificationProvider>
        <Router>
          <Layout>
            <AnimatePresence mode='wait'>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/state/:state" element={<StateJobs />} />
                <Route path="/category/:category" element={<CategoryJobs />} />
                <Route path="/qualification/:qualification" element={<QualificationJobs />} />
                <Route path="/notifications" element={<Notification />} />
                <Route path="/saved" element={<SavedJobs />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<SearchResults />} />
              </Routes>
            </AnimatePresence>
          </Layout>
        </Router>
      </NotificationProvider>
    </JobProvider>
  )
}

export default App
