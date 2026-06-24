import React from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Bookmark, 
  Clock, 
  MapPin, 
  Building2, 
  GraduationCap,
  Calendar,
  Users,
  DollarSign,
  Briefcase
} from 'lucide-react'
import { useJobs } from '../context/JobContext'
import { formatDate, getDaysRemaining, truncate, formatSalary, isJobOpen } from '../utils/helpers'

function JobCard({ job, variant = 'grid', onQuickApply, isSaved: externalIsSaved }) {
  const navigate = useNavigate()
  const { toggleSaveJob, isJobSaved } = useJobs()
  const isSaved = externalIsSaved !== undefined ? externalIsSaved : isJobSaved(job.id)
  const isOpen = isJobOpen(job.lastDate)

  const handleSaveToggle = (e) => {
    e.stopPropagation()
    toggleSaveJob(job.id)
  }

  const handleQuickApply = (e) => {
    e.stopPropagation()
    onQuickApply?.(job)
  }

  const handleCardClick = () => {
    navigate(`/jobs/${job.id}`)
  }

  // Card content
  const cardContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Organization Logo/Icon */}
          <div className="w-10 h-10 bg-gradient-to-br from-luxury-gold/10 to-luxury-purple/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-luxury-gold" />
          </div>
          
          {/* Title and Organization */}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white line-clamp-1 group-hover:text-luxury-gold transition-colors">
              {job.title}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {job.organization}
            </p>
          </div>
        </div>
        
        {/* Save Button */}
        <motion.button
          onClick={handleSaveToggle}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Bookmark 
            className={`w-5 h-5 ${isSaved ? 'text-luxury-gold fill-luxury-gold' : 'text-gray-400'}`} 
          />
        </motion.button>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
        {truncate(job.description, 100)}
      </p>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Salary */}
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-luxury-gold" />
          <span className="text-gray-300">{formatSalary(job.salary)}</span>
        </div>
        
        {/* Posts */}
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{job.posts} Posts</span>
        </div>
        
        {/* Last Date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className={`text-sm ${isOpen ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatDate(job.lastDate)}
          </span>
        </div>
        
        {/* Days Remaining */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className={`text-sm ${isOpen ? 'text-emerald-400' : 'text-red-400'}`}>
            {getDaysRemaining(job.lastDate)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400">{job.state}</span>
        </div>
        
        {/* Category */}
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400">{job.category}</span>
        </div>
      </div>

      {/* Quick Apply Button */}
      <motion.button
        onClick={handleQuickApply}
        whileTap={{ scale: 0.95 }}
        className="mt-4 w-full bg-gradient-to-r from-luxury-gold/20 to-luxury-gold/10 text-luxury-gold py-2 px-4 rounded-xl text-sm font-medium hover:from-luxury-gold/30 hover:to-luxury-gold/20 transition-all border border-luxury-gold/20"
      >
        {isSaved ? 'Saved' : 'Save Job'}
      </motion.button>
    </div>
  )

  // Grid variant
  if (variant === 'grid') {
    return (
      <motion.div
        onClick={handleCardClick}
        className="job-card group cursor-pointer"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        {cardContent}
        
        {/* Live Badge */}
        {job.isLive && (
          <div className="absolute top-4 right-4 badge-live">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span>Live</span>
          </div>
        )}
        
        {/* New Badge */}
        {job.status === 'active' && (
          <div className="absolute top-4 right-20 badge-new">
            <span>New</span>
          </div>
        )}
      </motion.div>
    )
  }

  // List variant
  if (variant === 'list') {
    return (
      <motion.div
        onClick={handleCardClick}
        className="job-card group cursor-pointer flex gap-4"
        whileHover={{ x: 4 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image/Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-luxury-gold/10 to-luxury-purple/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Building2 className="w-8 h-8 text-luxury-gold" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {cardContent}
        </div>
        
        {/* Badges */}
        <div className="flex flex-col gap-2 justify-center">
          {job.isLive && <span className="badge-live !w-fit">Live</span>}
          {job.status === 'active' && <span className="badge-new !w-fit">New</span>}
        </div>
      </motion.div>
    )
  }

  // Default to grid
  return (
    <motion.div
      onClick={handleCardClick}
      className="job-card group cursor-pointer"
      whileHover={{ y: -4 }}
    >
      {cardContent}
    </motion.div>
  )
}

export default JobCard
