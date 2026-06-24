import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { JobProvider } from './context/JobContext'
import { NotificationProvider } from './context/NotificationContext'
import { OnboardingProvider } from './context/OnboardingContext'
import Layout from './components/Layout'
import AdminLayout from './pages/Admin/AdminDashboard'
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
import Admin from './pages/Admin'

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
          <AnimatePresence mode='wait'>
            <Routes>
              {/* Main Site Routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
              <Route path="/jobs/:id" element={<Layout><JobDetail /></Layout>} />
              <Route path="/state/:state" element={<Layout><StateJobs /></Layout>} />
              <Route path="/category/:category" element={<Layout><CategoryJobs /></Layout>} />
              <Route path="/qualification/:qualification" element={<Layout><QualificationJobs /></Layout>} />
              <Route path="/notifications" element={<Layout><Notification /></Layout>} />
              <Route path="/saved" element={<Layout><SavedJobs /></Layout>} />
              <Route path="/profile" element={<Layout><Profile /></Layout>} />
              <Route path="/search" element={<Layout><SearchResults /></Layout>} />
              
              {/* Admin Routes (No Layout) */}
              <Route path="/admin/*" element={<Admin />} />
            </Routes>
          </AnimatePresence>
        </Router>
      </NotificationProvider>
    </JobProvider>
  )
}

export default App
