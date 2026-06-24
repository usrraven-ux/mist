import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, ArrowLeft, Grid3X3, List, SortAsc, SortDesc } from 'lucide-react'
import { useJobs } from '../context/JobContext'
import JobCard from '../components/JobCard'
import { sortJobs } from '../utils/helpers'
import { states } from '../utils/mockData'

function StateJobs() {
  const { state } = useParams()
  const navigate = useNavigate()
  const { jobs, toggleSaveJob, isJobSaved } = useJobs()
  
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('latest')
  const [sortDirection, setSortDirection] = useState('desc')
  const [stateJobs, setStateJobs] = useState([])

  // Get state name from param
  const stateName = decodeURIComponent(state) || ''
  const stateDisplayName = states.find(s => s.toLowerCase() === stateName.toLowerCase()) || stateName

  // Filter jobs by state
  useEffect(() => {
    const filtered = jobs.filter(job => 
      job.state.toLowerCase() === stateName.toLowerCase() ||
      job.state === stateName
    )
    setStateJobs(filtered)
  }, [jobs, stateName])

  // Apply sorting
  const sortedJobs = sortJobs(stateJobs, sortBy)
  if (sortDirection === 'asc') {
    sortedJobs.reverse()
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex-1 flex items-center gap-3">
          <div className="w-10 h-10 bg-luxury-gold/10 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-luxury-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Jobs in {stateDisplayName}</h1>
            <p className="text-gray-400">{stateJobs.length} jobs found</p>
          </div>
        </div>
      </motion.div>

      {/* Sort and View Options */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-luxury-gold"
          >
            <option value="latest">Latest</option>
            <option value="closing-soon">Closing Soon</option>
            <option value="salary-high">Salary: High to Low</option>
            <option value="posts-high">Posts: High to Low</option>
          </select>
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-colors"
          >
            {sortDirection === 'asc' ? (
              <SortAsc className="w-5 h-5" />
            ) : (
              <SortDesc className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">View:</span>
          <div className="flex bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-luxury-gold text-luxury-deep' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-luxury-gold text-luxury-deep' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Jobs Grid/List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}
      >
        {stateJobs.length > 0 ? (
          sortedJobs.map((job, index) => (
            <motion.div
              key={job.id}
              variants={itemVariants}
              custom={index}
            >
              <JobCard
                job={job}
                variant={viewMode}
                onQuickApply={() => toggleSaveJob(job.id)}
                isSaved={isJobSaved(job.id)}
              />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full text-center py-16"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Jobs Found</h2>
            <p className="text-gray-400 mb-6">
              There are currently no jobs available in {stateDisplayName}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/jobs')} className="btn-gold-outline">
                Browse All Jobs
              </button>
              <button onClick={() => navigate('/')} className="btn-gold">
                Go to Home
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Other States */}
      {stateJobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="luxury-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Explore Other States</h3>
          <div className="flex flex-wrap gap-2">
            {states.slice(0, 10).map((s) => (
              <button
                key={s}
                onClick={() => navigate(`/state/${encodeURIComponent(s)}`)}
                className="filter-chip hover:border-luxury-gold/20"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default StateJobs
