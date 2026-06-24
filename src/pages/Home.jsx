import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Search, 
  TrendingUp, 
  Clock, 
  Award, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Building2,
  ChevronRight,
  Sparkles,
  Star
} from 'lucide-react'
import { useJobs } from '../context/JobContext'
import { useNotifications } from '../context/NotificationContext'
import { states, categories, qualifications } from '../utils/mockData'
import { formatDate, getDaysRemaining, truncate, formatNumber } from '../utils/helpers'
import JobCard from '../components/JobCard'
import StatCard from '../components/StatCard'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'

function Home() {
  const navigate = useNavigate()
  const { jobs, filteredJobs, stats, toggleSaveJob, isJobSaved } = useJobs()
  const { addNotification } = useNotifications()
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [latestJobs, setLatestJobs] = useState([])
  const [trendingCategories, setTrendingCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setFeaturedJobs(jobs.filter(job => job.isLive).slice(0, 4))
      setLatestJobs(jobs.slice(0, 8))
      setTrendingCategories(categories.slice(0, 8))
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [jobs])

  // Handle quick apply
  const handleQuickApply = (job) => {
    toggleSaveJob(job.id)
    addNotification({
      title: 'Job Saved',
      message: `"${job.title}" has been saved to your list.`,
      jobId: job.id
    })
  }

  // Navigation handlers
  const handleStateSelect = (state) => {
    navigate(`/state/${encodeURIComponent(state)}`)
  }

  const handleCategorySelect = (category) => {
    navigate(`/category/${encodeURIComponent(category)}`)
  }

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton Hero */}
        <div className="h-96 bg-gradient-to-br from-luxury-gold/10 to-luxury-purple/10 rounded-3xl animate-pulse" />
        
        {/* Skeleton Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-luxury-deep via-luxury-deep to-gray-900 border border-white/10"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-luxury-gold/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-20 right-20 w-32 h-32 bg-luxury-purple/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-10 left-1/3 w-16 h-16 bg-luxury-gold/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 p-6 sm:p-8 lg:p-12">
          <div className="max-w-4xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-luxury-gold/10 text-luxury-gold px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>Premium Government Jobs</span>
              <Star className="w-4 h-4" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            >
              Find Your <span className="text-gradient">Dream</span> 
              <span className="text-luxury-gold">Government Job</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 text-lg sm:text-xl mb-8 max-w-2xl"
            >
              Discover thousands of government job opportunities across India with real-time updates, 
              smart filtering, and luxury experience.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-2xl"
            >
              <SearchBar />
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 grid grid-cols-3 gap-4 sm:gap-6"
            >
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-luxury-gold">{formatNumber(stats.liveUpdates)}</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">Live Updates</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-luxury-gold">{formatNumber(stats.activeVacancies)}</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">Active Vacancies</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-luxury-gold">{formatNumber(stats.examResults)}</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">Exam Results</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Jobs Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-bold text-white flex items-center gap-2"
          >
            <TrendingUp className="w-6 h-6 text-luxury-gold" />
            <span>Featured Opportunities</span>
          </motion.h2>
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/jobs')}
            className="text-luxury-gold text-sm font-medium hover:text-luxury-gold-dark transition-colors flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {featuredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              variants={itemVariants}
              custom={index}
            >
              <JobCard 
                job={job} 
                onQuickApply={handleQuickApply}
                isSaved={isJobSaved(job.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Quick Filters Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <motion.h2
          variants={itemVariants}
          className="text-2xl font-bold text-white flex items-center gap-2"
        >
          <Filter className="w-6 h-6 text-luxury-gold" />
          <span>Quick Filters</span>
        </motion.h2>

        {/* State Filter */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Popular States</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {states.slice(0, 8).map((state) => (
              <button
                key={state}
                onClick={() => handleStateSelect(state)}
                className="filter-chip hover:border-luxury-gold/30"
              >
                {state}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span>Job Categories</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className="filter-chip hover:border-luxury-gold/30"
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Qualification Filter */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>Qualifications</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {qualifications.slice(0, 8).map((qual) => (
              <button
                key={qual}
                className="filter-chip hover:border-luxury-gold/30"
              >
                {qual}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Latest Jobs Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-bold text-white flex items-center gap-2"
          >
            <Clock className="w-6 h-6 text-luxury-gold" />
            <span>Latest Job Notifications</span>
          </motion.h2>
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/jobs')}
            className="text-luxury-gold text-sm font-medium hover:text-luxury-gold-dark transition-colors flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {latestJobs.map((job, index) => (
            <motion.div
              key={job.id}
              variants={itemVariants}
              custom={index}
            >
              <JobCard 
                job={job} 
                variant="list"
                onQuickApply={handleQuickApply}
                isSaved={isJobSaved(job.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Recruitment Boards Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <motion.h2
          variants={itemVariants}
          className="text-2xl font-bold text-white flex items-center gap-2"
        >
          <Building2 className="w-6 h-6 text-luxury-gold" />
          <span>Top Recruitment Boards</span>
        </motion.h2>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
        >
          {[
            { name: 'UPSC', jobs: 124 },
            { name: 'SSC', jobs: 89 },
            { name: 'SBI', jobs: 45 },
            { name: 'RBI', jobs: 32 },
            { name: 'IBPS', jobs: 67 },
            { name: 'Railway', jobs: 156 },
            { name: 'Indian Army', jobs: 82 },
            { name: 'Indian Navy', jobs: 54 },
            { name: 'DRDO', jobs: 28 },
            { name: 'ISRO', jobs: 19 },
            { name: 'AIIMS', jobs: 37 },
            { name: 'ONGC', jobs: 23 },
          ].map((board, index) => (
            <motion.button
              key={board.name}
              variants={itemVariants}
              custom={index}
              onClick={() => navigate(`/jobs?board=${encodeURIComponent(board.name)}`)}
              className="luxury-card text-center p-4 hover:border-luxury-gold/20 transition-all group"
            >
              <p className="text-lg font-bold text-white group-hover:text-luxury-gold transition-colors">{board.name}</p>
              <p className="text-xs text-gray-400 mt-1">{board.jobs} jobs</p>
            </motion.button>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="py-12"
      >
        <div className="luxury-card text-center py-12 px-6">
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-2xl flex items-center justify-center mx-auto mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Award className="w-8 h-8 text-luxury-deep" />
          </motion.div>
          <motion.h3
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Never Miss a Government Job Again
          </motion.h3>
          <motion.p
            className="text-gray-400 mb-6 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Get instant notifications for new job postings, exam dates, and results directly to your device.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/notifications')}
              className="btn-gold-outline"
            >
              Manage Notifications
            </button>
            <button
              onClick={() => navigate('/jobs')}
              className="btn-gold"
            >
              Browse All Jobs
            </button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home
