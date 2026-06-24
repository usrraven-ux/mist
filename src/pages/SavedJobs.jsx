import React from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Bookmark, X, Clock, Calendar } from 'lucide-react'
import { useJobs } from '../context/JobContext'
import JobCard from '../components/JobCard'
import { formatDate, getDaysRemaining } from '../utils/helpers'

function SavedJobs() {
  const navigate = useNavigate()
  const { jobs, savedJobs, toggleSaveJob, isJobSaved } = useJobs()
  
  const savedJobsList = jobs.filter(job => savedJobs.includes(job.id))

  const handleUnsaveAll = () => {
    savedJobs.forEach(jobId => {
      toggleSaveJob(jobId)
    })
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Saved Jobs</h1>
          <p className="text-gray-400">{savedJobsList.length} jobs saved</p>
        </div>
        
        {savedJobsList.length > 0 && (
          <button
            onClick={handleUnsaveAll}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
            <span>Clear All</span>
          </button>
        )}
      </motion.div>

      {/* Empty State */}
      {savedJobsList.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Saved Jobs</h2>
          <p className="text-gray-400 mb-6">Start saving jobs to keep track of opportunities you're interested in.</p>
          <button onClick={() => navigate('/jobs')} className="btn-gold">
            Browse Jobs
          </button>
        </motion.div>
      ) : (
        <>
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4"
          >
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-lg font-bold text-luxury-gold">{savedJobsList.length}</p>
              <p className="text-xs text-gray-400 mt-1">Total Saved</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-lg font-bold text-emerald-400">
                {savedJobsList.filter(job => getDaysRemaining(job.lastDate) !== 'Closed').length}
              </p>
              <p className="text-xs text-gray-400 mt-1">Still Open</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-lg font-bold text-red-400">
                {savedJobsList.filter(job => getDaysRemaining(job.lastDate) === 'Closed').length}
              </p>
              <p className="text-xs text-gray-400 mt-1">Closed</p>
            </div>
          </motion.div>

          {/* Jobs Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {savedJobsList.map((job, index) => (
              <motion.div
                key={job.id}
                variants={itemVariants}
                custom={index}
              >
                <JobCard
                  job={job}
                  onQuickApply={() => toggleSaveJob(job.id)}
                  isSaved={isJobSaved(job.id)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Sorting Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
          >
            <p className="text-sm text-gray-400">Sort by:</p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-luxury-gold/10 text-luxury-gold rounded-full text-sm font-medium">
                Newest
              </button>
              <button className="px-3 py-1.5 text-gray-400 hover:bg-white/10 rounded-full text-sm">
                Closing Soon
              </button>
              <button className="px-3 py-1.5 text-gray-400 hover:bg-white/10 rounded-full text-sm">
                Salary: High to Low
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}

export default SavedJobs
