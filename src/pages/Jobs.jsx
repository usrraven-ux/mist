import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  Grid3X3,
  List,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useJobs } from '../context/JobContext'
import JobCard from '../components/JobCard'
import SearchBar from '../components/SearchBar'
import { states, categories, qualifications, recruitmentBoards } from '../utils/mockData'
import { sortJobs, debounce } from '../utils/helpers'

function Jobs() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { 
    jobs, 
    filteredJobs, 
    filters, 
    setFilters,
    toggleSaveJob,
    isJobSaved,
    loading
  } = useJobs()
  
  const [viewMode, setViewMode] = useState('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('latest')
  const [sortDirection, setSortDirection] = useState('desc')
  const [activeFilters, setActiveFilters] = useState({})
  const [isScrolled, setIsScrolled] = useState(false)

  // Sync with URL params
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries())
    if (params.view) setViewMode(params.view)
    if (params.sort) setSortBy(params.sort)
    if (params.direction) setSortDirection(params.direction)
  }, [searchParams])

  // Update URL on changes
  useEffect(() => {
    const newParams = new URLSearchParams()
    if (viewMode !== 'grid') newParams.set('view', viewMode)
    if (sortBy !== 'latest') newParams.set('sort', sortBy)
    if (sortDirection !== 'desc') newParams.set('direction', sortDirection)
    setSearchParams(newParams)
  }, [viewMode, sortBy, sortDirection, setSearchParams])

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Apply sorting
  const sortedJobs = sortJobs(filteredJobs, sortBy)
  if (sortDirection === 'asc') {
    sortedJobs.reverse()
  }

  // Filter options
  const filterOptions = [
    {
      name: 'State',
      key: 'state',
      options: states,
      icon: '📍'
    },
    {
      name: 'Category',
      key: 'category',
      options: categories,
      icon: '💼'
    },
    {
      name: 'Qualification',
      key: 'qualification',
      options: qualifications,
      icon: '🎓'
    },
    {
      name: 'Recruitment Board',
      key: 'board',
      options: recruitmentBoards,
      icon: '🏛️'
    }
  ]

  // Apply filter
  const applyFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }))
    setActiveFilters(prev => ({ ...prev, [key]: prev[key] === value ? undefined : value }))
  }

  // Clear filter
  const clearFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: '' }))
    setActiveFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      state: '',
      category: '',
      qualification: '',
      board: '',
      search: ''
    })
    setActiveFilters({})
  }

  // Toggle filter dropdown
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  // Handle search
  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }))
  }

  // Debounced search
  const debouncedSearch = debounce(handleSearch, 500)

  // Filter count
  const activeFilterCount = Object.keys(activeFilters).length

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-white/5 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">All Government Jobs</h1>
          <p className="text-gray-400">{filteredJobs.length} jobs found</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
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
          
          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-colors"
            >
              <span className="text-sm">Sort: {sortBy}</span>
              {sortDirection === 'asc' ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
            </button>
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={toggleFilter}
            className="flex items-center gap-2 bg-luxury-gold hover:bg-luxury-gold-dark px-4 py-2 rounded-xl text-luxury-deep font-medium transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span className="text-sm">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-white/20 text-luxury-deep text-xs font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SearchBar onChange={(e) => debouncedSearch(e.target.value)} />
      </motion.div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-wrap gap-2 p-4 bg-white/5 rounded-xl"
        >
          <span className="text-sm text-gray-400 mr-2">Active filters:</span>
          {Object.entries(activeFilters).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 bg-luxury-gold/10 text-luxury-gold px-3 py-1 rounded-full text-sm">
              <span>{value}</span>
              <button onClick={() => clearFilter(key)} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button onClick={clearAllFilters} className="text-gray-400 hover:text-white text-sm flex items-center gap-1 ml-auto">
            <X className="w-4 h-4" />
            Clear all
          </button>
        </motion.div>
      )}

      {/* Filter Dropdown */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Filter Jobs</h3>
              <button onClick={toggleFilter} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filterOptions.map((filter) => (
                <div key={filter.key} className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <span>{filter.icon}</span>
                    <span>{filter.name}</span>
                  </h4>
                  <div className="max-h-40 overflow-y-auto hide-scrollbar">
                    {filter.options.slice(0, 8).map((option) => (
                      <button
                        key={option}
                        onClick={() => applyFilter(filter.key, option)}
                        className={`w-full text-left p-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                          filters[filter.key] === option
                            ? 'bg-luxury-gold/10 text-luxury-gold'
                            : 'text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        {filters[filter.key] === option && (
                          <Check className="w-4 h-4" />
                        )}
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
              <button onClick={clearAllFilters} className="btn-gold-outline text-sm">
                Clear All
              </button>
              <button onClick={toggleFilter} className="btn-gold text-sm">
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Jobs Grid/List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}
      >
        <AnimatePresence mode="wait">
          {sortedJobs.length > 0 ? (
            sortedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                variants={itemVariants}
                custom={index}
                layout
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
              className="col-span-full text-center py-12"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
              <p className="text-gray-400 mb-4">Try adjusting your filters or search criteria</p>
              <button onClick={clearAllFilters} className="btn-gold-outline">
                Clear All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Load More / Pagination */}
      {sortedJobs.length >= 10 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <button
            onClick={() => navigate('/jobs?page=2')}
            className="btn-gold-outline"
          >
            Load More Jobs
          </button>
        </motion.div>
      )}

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-20 right-6 w-12 h-12 bg-luxury-gold hover:bg-luxury-gold-dark rounded-full flex items-center justify-center text-luxury-deep shadow-luxury-lg transition-colors z-40"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Jobs
