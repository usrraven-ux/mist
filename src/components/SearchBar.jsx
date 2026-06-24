import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, X, Filter, Mic } from 'lucide-react'
import { useJobs } from '../context/JobContext'
import { debounce } from '../utils/helpers'

function SearchBar({ onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { filters, setFilters } = useJobs()
  const [searchQuery, setSearchQuery] = useState(filters.search || '')
  const [isFocused, setIsFocused] = useState(false)
  const [isListening, setIsListening] = useState(false)

  // Sync with filters
  useEffect(() => {
    setSearchQuery(filters.search || '')
  }, [filters.search])

  // Debounced search
  const debouncedSearch = debounce((query) => {
    setFilters(prev => ({ ...prev, search: query }))
    if (query) {
      navigate(`/search?query=${encodeURIComponent(query)}`)
    } else if (location.pathname === '/search') {
      navigate('/')
    }
  }, 500)

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setFilters(prev => ({ ...prev, search: searchQuery }))
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
      onClose?.()
    }
  }

  const handleClear = () => {
    setSearchQuery('')
    setFilters(prev => ({ ...prev, search: '' }))
    if (location.pathname === '/search') {
      navigate('/')
    }
  }

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      
      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        debouncedSearch(transcript)
      }
      
      recognition.start()
    } else {
      alert('Voice search is not supported in your browser')
    }
  }

  const handleFilterClick = () => {
    // Open filter modal or navigate to filter page
    navigate('/jobs?filter=true')
    onClose?.()
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="search-bar">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {isListening ? (
            <div className="animate-pulse">
              <Mic className="w-5 h-5 text-luxury-gold" />
            </div>
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {/* Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search jobs, organizations, qualifications..."
          className="w-full pl-12 pr-12 py-3 bg-transparent text-white placeholder:text-gray-400 focus:outline-none"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-16 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}

        {/* Filter Button */}
        <button
          type="button"
          onClick={handleFilterClick}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors hidden sm:flex"
        >
          <Filter className="w-5 h-5 text-gray-400" />
        </button>

        {/* Voice Search Button - Mobile */}
        <button
          type="button"
          onClick={handleVoiceSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors sm:hidden"
        >
          <Mic className={`w-5 h-5 ${isListening ? 'text-luxury-gold animate-pulse' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {isFocused && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-luxury-deep border border-white/10 rounded-2xl shadow-luxury-lg overflow-hidden z-50">
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-2">Suggestions for "{searchQuery}"</p>
            <div className="space-y-2">
              {[
                `${searchQuery} jobs`,
                `${searchQuery} recruitment 2026`,
                `${searchQuery} notification`,
                `${searchQuery} apply online`,
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(suggestion)
                    setFilters(prev => ({ ...prev, search: suggestion }))
                    navigate(`/search?query=${encodeURIComponent(suggestion)}`)
                    setIsFocused(false)
                    onClose?.()
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 text-sm"
                >
                  <Search className="w-4 h-4 inline mr-2" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export default SearchBar
