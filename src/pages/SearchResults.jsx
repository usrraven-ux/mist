import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, X, Filter, SortAsc, SortDesc, Grid3X3, List } from 'lucide-react'
import { useJobs } from '../context/JobContext'
import JobCard from '../components/JobCard'
import SearchBar from '../components/SearchBar'
import { sortJobs, debounce } from '../utils/helpers'

function SearchResults() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { filteredJobs, filters, setFilters, toggleSaveJob, isJobSaved } = useJobs()
  
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [sortDirection, setSortDirection] = useState('desc')
  const [searchQuery, setSearchQuery] = useState('')

  // Sync with URL params
  useEffect(() => {
    const query = searchParams.get('query') || ''
    setSearchQuery(query)
    setFilters(prev => ({ ...prev, search: query }))
    
    const view = searchParams.get('view')
    if (view) setViewMode(view)
    
    const sort = searchParams.get('sort')
    if (sort) setSortBy(sort)
    
    const direction = searchParams.get('direction')
    if (direction) setSortDirection(direction)
  }, [searchParams, setFilters])

  // Update URL on changes
  useEffect(() => {
    const newParams = new URLSearchParams()
    if (searchQuery) newParams.set('query', searchQuery)
    if (viewMode !== 'grid') newParams.set('view', viewMode)
    if (sortBy !== 'relevance') newParams.set('sort', sortBy)
    if (sortDirection !== 'desc') newParams.set('direction', sortDirection)
    setSearchParams(newParams)
  }, [searchQuery, viewMode, sortBy, sortDirection, setSearchParams])

  // Apply sorting
  const sortedJobs = sortJobs(filteredJobs, sortBy === 'relevance' ? 'latest' : sortBy)
  if (sortDirection === 'asc') {
    sortedJobs.reverse()
  }

  // Debounced search
  const debouncedSearch = debounce((query) => {
    setSearchQuery(query)
    setFilters(prev => ({ ...prev, search: query }))
  }, 500)

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setFilters(prev => ({ ...prev, search: '' }))
    navigate('/')
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
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-1">Search Results</h1>
          <p className="text-gray-400">
            {sortedJobs.length} results for "{searchQuery}"
          </p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <SearchBar 
            value={searchQuery} 
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Sort and View Options */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-luxury-gold"
          >
            <option value="relevance">Relevance</option>
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

      {/* Results Count */}
      {sortedJobs.length > 0 && (
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-400"
        >
          Showing {sortedJobs.length} results for "{searchQuery}"
        </motion.p>
      )}

      {/* Search Results */}
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
        {sortedJobs.length > 0 ? (
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
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Results Found</h2>
            <p className="text-gray-400 mb-6">
              We couldn't find any jobs matching "{searchQuery}"
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleClearSearch} className="btn-gold-outline">
                Clear Search
              </button>
              <button onClick={() => navigate('/jobs')} className="btn-gold">
                Browse All Jobs
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Suggestions */}
      {sortedJobs.length === 0 && searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="luxury-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Try these suggestions:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'SBI',
              'UPSC',
              'Railway',
              'Banking',
              'Engineering',
              'Medical',
              'Graduate',
              '12th Pass'
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setSearchQuery(suggestion)
                  setFilters(prev => ({ ...prev, search: suggestion }))
                }}
                className="filter-chip hover:border-luxury-gold/20"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default SearchResults
