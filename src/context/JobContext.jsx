import React, { createContext, useContext, useState, useEffect } from 'react'
import { mockJobs, states, categories, qualifications, recruitmentBoards } from '../utils/mockData'

const JobContext = createContext()

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    state: '',
    category: '',
    qualification: '',
    board: '',
    search: '',
  })
  const [savedJobs, setSavedJobs] = useState([])
  const [appliedJobs, setAppliedJobs] = useState([])
  const [stats, setStats] = useState({
    liveUpdates: 0,
    activeVacancies: 0,
    examResults: 0,
  })

  useEffect(() => {
    // Simulate API fetch
    const fetchJobs = async () => {
      try {
        setLoading(true)
        // In production, this would be an API call
        // const response = await fetch('/api/jobs')
        // const data = await response.json()
        // setJobs(data)
        
        // For demo, use mock data
        setJobs(mockJobs)
        setStats({
          liveUpdates: mockJobs.filter(job => job.isLive).length,
          activeVacancies: mockJobs.filter(job => job.status === 'active').length,
          examResults: mockJobs.filter(job => job.type === 'result').length,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchJobs()
  }, [])

  useEffect(() => {
    // Load saved jobs from localStorage
    const saved = localStorage.getItem('govtrank_saved_jobs')
    if (saved) {
      setSavedJobs(JSON.parse(saved))
    }
    
    const applied = localStorage.getItem('govtrank_applied_jobs')
    if (applied) {
      setAppliedJobs(JSON.parse(applied))
    }
  }, [])

  useEffect(() => {
    // Save to localStorage when changed
    localStorage.setItem('govtrank_saved_jobs', JSON.stringify(savedJobs))
  }, [savedJobs])

  useEffect(() => {
    localStorage.setItem('govtrank_applied_jobs', JSON.stringify(appliedJobs))
  }, [appliedJobs])

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const toggleApplyJob = (jobId) => {
    setAppliedJobs(prev => 
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const isJobSaved = (jobId) => savedJobs.includes(jobId)
  const isJobApplied = (jobId) => appliedJobs.includes(jobId)

  const filteredJobs = jobs.filter(job => {
    const matchesState = filters.state ? job.state === filters.state : true
    const matchesCategory = filters.category ? job.category === filters.category : true
    const matchesQualification = filters.qualification ? 
      job.qualification.includes(filters.qualification) : true
    const matchesBoard = filters.board ? job.board === filters.board : true
    const matchesSearch = filters.search ? 
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.organization.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.search.toLowerCase())
      : true
    
    return matchesState && matchesCategory && matchesQualification && matchesBoard && matchesSearch
  })

  const getJobById = (id) => jobs.find(job => job.id === id)

  const value = {
    jobs,
    filteredJobs,
    loading,
    error,
    filters,
    setFilters,
    savedJobs,
    appliedJobs,
    toggleSaveJob,
    toggleApplyJob,
    isJobSaved,
    isJobApplied,
    getJobById,
    stats,
    states,
    categories,
    qualifications,
    recruitmentBoards,
  }

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  )
}

export function useJobs() {
  const context = useContext(JobContext)
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider')
  }
  return context
}
