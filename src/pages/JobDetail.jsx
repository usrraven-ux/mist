import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  Download, 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  Building2, 
  MapPin, 
  GraduationCap,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Printer
} from 'lucide-react'
import { useJobs } from '../context/JobContext'
import { useNotifications } from '../context/NotificationContext'
import { formatDate, getDaysRemaining, formatSalary, isJobOpen } from '../utils/helpers'
import LoadingScreen from '../components/LoadingScreen'

function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getJobById, toggleSaveJob, isJobSaved, toggleApplyJob, isJobApplied } = useJobs()
  const { addNotification } = useNotifications()
  
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSaved, setIsSaved] = useState(false)
  const [isApplied, setIsApplied] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  useEffect(() => {
    const fetchJob = () => {
      try {
        setLoading(true)
        const jobData = getJobById(id)
        if (!jobData) {
          throw new Error('Job not found')
        }
        setJob(jobData)
        setIsSaved(isJobSaved(jobData.id))
        setIsApplied(isJobApplied(jobData.id))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchJob()
  }, [id, getJobById, isJobSaved, isJobApplied])

  useEffect(() => {
    if (job) {
      setIsSaved(isJobSaved(job.id))
      setIsApplied(isJobApplied(job.id))
    }
  }, [job, isJobSaved, isJobApplied])

  const handleSaveToggle = () => {
    toggleSaveJob(job.id)
    setIsSaved(!isSaved)
    addNotification({
      title: isSaved ? 'Job Unsaved' : 'Job Saved',
      message: `"${job.title}" has been ${isSaved ? 'removed from' : 'added to'} your saved list.`,
      jobId: job.id
    })
  }

  const handleApplyToggle = () => {
    toggleApplyJob(job.id)
    setIsApplied(!isApplied)
    addNotification({
      title: 'Application Status Updated',
      message: `You have ${isApplied ? 'unmarked' : 'marked'} "${job.title}" as applied.`,
      jobId: job.id
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: job.description,
        url: window.location.href
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      prompt('Copy this link:', window.location.href)
    }
  }

  const handleDownload = () => {
    // Simulate PDF download
    const link = document.createElement('a')
    link.href = job.notificationPdf || '/pdfs/sample.pdf'
    link.download = `${job.title.replace(/\s+/g, '_')}_Notification.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    addNotification({
      title: 'PDF Downloaded',
      message: `Notification PDF for "${job.title}" has been downloaded.`,
      jobId: job.id
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleApplyNow = () => {
    // In production, this would redirect to the actual application link
    if (job.applyLink) {
      window.open(job.applyLink, '_blank')
      toggleApplyJob(job.id)
      setIsApplied(true)
      addNotification({
        title: 'Application Started',
        message: `You are being redirected to apply for "${job.title}".`,
        jobId: job.id
      })
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{error}</h2>
          <p className="text-gray-400 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/jobs')} className="btn-gold">
            Browse All Jobs
          </button>
        </div>
      </div>
    )
  }

  if (!job) {
    return null
  }

  const isOpen = isJobOpen(job.lastDate)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
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
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white line-clamp-1">{job.title}</h1>
          <p className="text-gray-400 text-sm">{job.organization}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-colors hidden sm:flex"
          >
            <Printer className="w-5 h-5" />
          </button>
          <button
            onClick={handleSaveToggle}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-luxury-gold transition-colors"
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'text-luxury-gold fill-luxury-gold' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-luxury-deep via-luxury-deep to-gray-900 border border-white/10"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>

        <div className="relative z-10 p-6 sm:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            {/* Badges */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2 mb-6"
            >
              {job.isLive && (
                <span className="badge-live">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span>Live Now</span>
                </span>
              )}
              {job.status === 'active' && <span className="badge-new">New</span>}
              {job.type === 'walkin' && <span className="badge-urgent">Walk-in</span>}
              {job.type === 'result' && (
                <span className="badge-luxury">
                  <CheckCircle className="w-3 h-3" />
                  <span>Result</span>
                </span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              {job.title}
            </motion.h1>

            {/* Organization */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-luxury-gold/10 to-luxury-purple/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-luxury-gold" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{job.organization}</h2>
                <p className="text-gray-400 text-sm">{job.board}</p>
              </div>
            </motion.div>

            {/* Key Info */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
            >
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <DollarSign className="w-6 h-6 text-luxury-gold mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-1">Salary</p>
                <p className="font-semibold text-white">{formatSalary(job.salary)}</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <Users className="w-6 h-6 text-luxury-gold mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-1">Total Posts</p>
                <p className="font-semibold text-white">{job.posts}</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <Calendar className="w-6 h-6 text-luxury-gold mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-1">Last Date</p>
                <p className={`font-semibold ${isOpen ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatDate(job.lastDate)}
                </p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <Clock className="w-6 h-6 text-luxury-gold mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-1">Time Left</p>
                <p className={`font-semibold ${isOpen ? 'text-emerald-400' : 'text-red-400'}`}>
                  {getDaysRemaining(job.lastDate)}
                </p>
              </div>
            </motion.div>

            {/* Apply Button */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleApplyNow}
                className="btn-gold flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Apply Now</span>
              </button>
              <button
                onClick={handleDownload}
                className="btn-gold-outline flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Details Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Content */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 space-y-6"
        >
          {/* Description */}
          <motion.div variants={itemVariants} className="luxury-card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Job Description</span>
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {showFullDescription ? (
                <>
                  {job.description}
                  <button
                    onClick={() => setShowFullDescription(false)}
                    className="text-luxury-gold font-medium mt-4 inline-flex items-center gap-1"
                  >
                    Show less
                  </button>
                </>
              ) : (
                <>
                  {job.description.slice(0, 300)}...
                  <button
                    onClick={() => setShowFullDescription(true)}
                    className="text-luxury-gold font-medium mt-4 inline-flex items-center gap-1"
                  >
                    Show more
                  </button>
                </>
              )}
            </p>
          </motion.div>

          {/* Eligibility */}
          <motion.div variants={itemVariants} className="luxury-card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Eligibility Criteria</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-luxury-gold mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white mb-1">Qualification</h4>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                    {job.qualification.map((qual, index) => (
                      <li key={index}>{qual}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-luxury-gold mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white mb-1">Job Location</h4>
                  <p className="text-gray-300 text-sm">{job.state}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-luxury-gold mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white mb-1">Category</h4>
                  <p className="text-gray-300 text-sm">{job.category}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Important Dates */}
          <motion.div variants={itemVariants} className="luxury-card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Important Dates</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-luxury-gold" />
                  <div>
                    <p className="font-medium text-white">Application Start Date</p>
                    <p className="text-xs text-gray-400">{formatDate(job.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-luxury-gold" />
                  <div>
                    <p className="font-medium text-white">Application Last Date</p>
                    <p className={`text-xs ${isOpen ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatDate(job.lastDate)}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  isOpen 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {isOpen ? getDaysRemaining(job.lastDate) : 'Closed'}
                </span>
              </div>

              {job.type === 'walkin' && (
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-luxury-gold" />
                    <div>
                      <p className="font-medium text-white">Walk-in Date</p>
                      <p className="text-xs text-gray-400">{formatDate(job.lastDate)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <motion.div variants={itemVariants} className="luxury-card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🏷️</span>
                <span>Tags</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <span key={index} className="badge-luxury">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 space-y-6"
        >
          {/* Job Actions */}
          <motion.div variants={itemVariants} className="luxury-card">
            <h3 className="text-lg font-semibold text-white mb-4">Job Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleSaveToggle}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  isSaved
                    ? 'bg-luxury-gold/10 border border-luxury-gold/20'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'text-luxury-gold fill-luxury-gold' : 'text-gray-400'}`} />
                  <span>{isSaved ? 'Saved' : 'Save Job'}</span>
                </div>
                {isSaved && <CheckCircle className="w-5 h-5 text-luxury-gold" />}
              </button>

              <button
                onClick={handleApplyToggle}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  isApplied
                    ? 'bg-luxury-gold/10 border border-luxury-gold/20'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className={`w-5 h-5 ${isApplied ? 'text-luxury-gold' : 'text-gray-400'}`} />
                  <span>{isApplied ? 'Applied' : 'Mark as Applied'}</span>
                </div>
                {isApplied && <CheckCircle className="w-5 h-5 text-luxury-gold" />}
              </button>

              <button
                onClick={handleShare}
                className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-gray-300 hover:text-white"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Job</span>
              </button>

              <button
                onClick={handleDownload}
                className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-gray-300 hover:text-white"
              >
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={handlePrint}
                className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-gray-300 hover:text-white"
              >
                <Printer className="w-5 h-5" />
                <span>Print Job</span>
              </button>
            </div>
          </motion.div>

          {/* Job Summary */}
          <motion.div variants={itemVariants} className="luxury-card">
            <h3 className="text-lg font-semibold text-white mb-4">Job Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Organization</span>
                <span className="text-white font-medium">{job.organization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recruitment Board</span>
                <span className="text-white font-medium">{job.board}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Job Type</span>
                <span className="text-white font-medium capitalize">{job.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className={`font-medium ${job.status === 'active' ? 'text-emerald-400' : 'text-gray-400'}`}>
                  {job.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Created</span>
                <span className="text-white font-medium">{formatDate(job.createdAt)}</span>
              </div>
            </div>
          </motion.div>

          {/* Similar Jobs */}
          <motion.div variants={itemVariants} className="luxury-card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
              <span>Similar Jobs</span>
              <button
                onClick={() => navigate('/jobs')}
                className="text-luxury-gold text-sm font-medium hover:text-luxury-gold-dark"
              >
                View All
              </button>
            </h3>
            <div className="space-y-3">
              {/* In a real app, you would fetch similar jobs based on category, qualification, etc. */}
              <p className="text-gray-400 text-sm text-center py-4">
                Similar jobs will appear here
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Apply Now CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="sticky bottom-0 bg-luxury-deep/90 backdrop-blur-lg border-t border-white/10 py-4"
      >
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={handleApplyNow}
            className="w-full btn-gold text-lg py-4 flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-6 h-6" />
            <span>Apply Now for {job.title}</span>
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">
            Last date: {formatDate(job.lastDate)} | {getDaysRemaining(job.lastDate)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default JobDetail
