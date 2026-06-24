import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe2, 
  RefreshCw, 
  Play, 
  StopCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  FileText,
  Settings
} from 'lucide-react'
import { scrapeWebsite, scrapeAllWebsites, startMonitoring, stopMonitoring } from '../../services/scraper/jobScraper'

function WebScraper() {
  const [scraping, setScraping] = useState(false)
  const [monitoring, setMonitoring] = useState(false)
  const [scrapeResults, setScrapeResults] = useState([])
  const [monitorIntervals, setMonitorIntervals] = useState([])
  const [selectedWebsite, setSelectedWebsite] = useState('all')
  const [scrapeHistory, setScrapeHistory] = useState([])

  // Website options
  const websites = [
    { key: 'UPSC', name: 'Union Public Service Commission', url: 'https://upsc.gov.in' },
    { key: 'SSC', name: 'Staff Selection Commission', url: 'https://ssc.nic.in' },
    { key: 'SBI', name: 'State Bank of India', url: 'https://sbi.co.in/careers' },
    { key: 'RBI', name: 'Reserve Bank of India', url: 'https://www.rbi.org.in' },
    { key: 'IBPS', name: 'Institute of Banking Personnel Selection', url: 'https://ibps.in' },
    { key: 'Railway', name: 'Indian Railways', url: 'https://indianrailways.gov.in' },
    { key: 'NTA', name: 'National Testing Agency', url: 'https://nta.ac.in' },
  ]

  // Scrape a single website
  const handleScrapeWebsite = async (websiteKey) => {
    setScraping(true)
    setScrapeResults([])
    
    try {
      const result = await scrapeWebsite(websiteKey)
      setScrapeResults([result])
      
      // Add to history
      setScrapeHistory(prev => [
        {
          website: websiteKey,
          time: new Date().toISOString(),
          jobsFound: result.newJobs?.length || 0,
          status: result.success ? 'success' : 'error'
        },
        ...prev.slice(0, 9) // Keep last 10
      ])
      
    } catch (error) {
      console.error('Scraping error:', error)
    } finally {
      setScraping(false)
    }
  }

  // Scrape all websites
  const handleScrapeAll = async () => {
    setScraping(true)
    setScrapeResults([])
    
    try {
      const results = await scrapeAllWebsites()
      setScrapeResults(results)
      
      // Add to history
      const totalJobs = results.reduce((sum, result) => sum + (result.newJobs?.length || 0), 0)
      setScrapeHistory(prev => [
        {
          website: 'All Websites',
          time: new Date().toISOString(),
          jobsFound: totalJobs,
          status: 'success'
        },
        ...prev.slice(0, 9)
      ])
      
    } catch (error) {
      console.error('Scraping error:', error)
    } finally {
      setScraping(false)
    }
  }

  // Start monitoring
  const handleStartMonitoring = () => {
    const monitors = startMonitoring()
    setMonitorIntervals(monitors)
    setMonitoring(true)
    
    setScrapeHistory(prev => [
      {
        website: 'All Websites',
        time: new Date().toISOString(),
        jobsFound: 0,
        status: 'monitoring_started'
      },
      ...prev.slice(0, 9)
    ])
  }

  // Stop monitoring
  const handleStopMonitoring = () => {
    stopMonitoring(monitorIntervals)
    setMonitorIntervals([])
    setMonitoring(false)
    
    setScrapeHistory(prev => [
      {
        website: 'All Websites',
        time: new Date().toISOString(),
        jobsFound: 0,
        status: 'monitoring_stopped'
      },
      ...prev.slice(0, 9)
    ])
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (monitoring) {
        stopMonitoring(monitorIntervals)
      }
    }
  }, [monitoring, monitorIntervals])

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
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Web Scraper</h1>
          <p className="text-gray-400">Automatically fetch job updates from government websites</p>
        </div>
        
        <div className="flex items-center gap-3">
          {monitoring ? (
            <button
              onClick={handleStopMonitoring}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-xl text-red-400 hover:text-red-300 transition-colors"
            >
              <StopCircle className="w-5 h-5" />
              <span>Stop Monitoring</span>
            </button>
          ) : (
            <button
              onClick={handleStartMonitoring}
              className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>Start Monitoring</span>
            </button>
          )}
          
          <button
            onClick={handleScrapeAll}
            disabled={scraping}
            className="flex items-center gap-2 bg-luxury-gold hover:bg-luxury-gold-dark px-4 py-2 rounded-xl text-luxury-deep font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {scraping ? (
              <div className="animate-spin rounded-full w-5 h-5 border-2 border-luxury-deep border-t-transparent" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            <span>Scrape All</span>
          </button>
        </div>
      </motion.div>

      {/* Monitoring Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`luxury-card ${monitoring ? 'border-emerald-400' : 'border-white/10'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            monitoring ? 'bg-emerald-500/10' : 'bg-white/5'
          }`}>
            {monitoring ? (
              <Play className="w-6 h-6 text-emerald-400" />
            ) : (
              <StopCircle className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">Monitoring Status</h3>
            <p className="text-gray-400 text-sm">
              {monitoring 
                ? 'Actively monitoring government websites for new job postings' 
                : 'Monitoring is currently stopped'}
            </p>
          </div>
          <div className={`w-3 h-3 rounded-full ${
            monitoring ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'
          }`} />
        </div>
      </motion.div>

      {/* Scrape Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="luxury-card"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe2 className="w-5 h-5" />
          <span>Scrape Individual Websites</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {websites.map((website) => (
            <button
              key={website.key}
              onClick={() => handleScrapeWebsite(website.key)}
              disabled={scraping}
              className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                scraping 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-white/5 hover:border-luxury-gold/20 border border-white/10'
              }`}
            >
              <div className="w-8 h-8 bg-luxury-gold/10 rounded-lg flex items-center justify-center">
                <Globe2 className="w-4 h-4 text-luxury-gold" />
              </div>
              <div className="text-left">
                <p className="font-medium text-white">{website.name}</p>
                <p className="text-xs text-gray-400">{website.key}</p>
              </div>
              <RefreshCw className="w-4 h-4 text-gray-400 ml-auto" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Scrape Results */}
      {scrapeResults.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="luxury-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <span>Scrape Results</span>
          </h3>
          
          <div className="space-y-4">
            {scrapeResults.map((result, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                custom={index}
                className={`p-4 rounded-xl ${
                  result.success 
                    ? 'bg-emerald-500/5 border border-emerald-500/20' 
                    : 'bg-red-500/5 border border-red-500/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      result.success ? 'bg-emerald-500/10' : 'bg-red-500/10'
                    }`}>
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{result.website}</h4>
                      <p className="text-xs text-gray-400">
                        {result.success 
                          ? `${result.newJobs?.length || 0} new jobs found` 
                          : result.error || 'Error scraping website'}
                      </p>
                    </div>
                  </div>
                  
                  {result.success && result.newJobs?.length > 0 && (
                    <button className="text-luxury-gold text-sm font-medium hover:text-luxury-gold-dark">
                      View Jobs
                    </button>
                  )}
                </div>
                
                {result.success && result.newJobs?.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {result.newJobs.slice(0, 3).map((job, jobIndex) => (
                      <div key={jobIndex} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm text-white line-clamp-1">{job.title}</p>
                          <p className="text-xs text-gray-400">{job.url}</p>
                        </div>
                      </div>
                    ))}
                    {result.newJobs.length > 3 && (
                      <p className="text-xs text-gray-400 text-center pt-2">
                        + {result.newJobs.length - 3} more jobs
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Scrape History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="luxury-card"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span>Scrape History</span>
        </h3>
        
        {scrapeHistory.length > 0 ? (
          <div className="space-y-3">
            {scrapeHistory.map((history, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  history.status === 'success' ? 'bg-emerald-500/5' :
                  history.status === 'error' ? 'bg-red-500/5' :
                  'bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    {history.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : history.status === 'error' ? (
                      <XCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-luxury-gold" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{history.website}</p>
                    <p className="text-xs text-gray-400">{history.jobsFound} jobs found</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {new Date(history.time).toLocaleString()}
                  </p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${
                    history.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                    history.status === 'error' ? 'bg-red-500/10 text-red-400' :
                    'bg-luxury-gold/10 text-luxury-gold'
                  }`}>
                    {history.status.replace('_', ' ')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No scrape history yet</p>
            <p className="text-gray-500 text-sm mt-1">Start scraping to see results</p>
          </div>
        )}
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="luxury-card"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <span>Scraper Settings</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-luxury-gold" />
              <div>
                <p className="font-medium text-white">Scrape Interval</p>
                <p className="text-xs text-gray-400">How often to check for new jobs</p>
              </div>
            </div>
            <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white">
              <option>Daily</option>
              <option>Every 12 Hours</option>
              <option>Every 6 Hours</option>
              <option>Every Hour</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-luxury-gold" />
              <div>
                <p className="font-medium text-white">Email Notifications</p>
                <p className="text-xs text-gray-400">Get email alerts for new jobs</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-luxury-gold bg-luxury-gold flex items-center justify-center">
              <Check className="w-4 h-4 text-luxury-deep" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <Globe2 className="w-5 h-5 text-luxury-gold" />
              <div>
                <p className="font-medium text-white">User Agent</p>
                <p className="text-xs text-gray-400">Custom user agent for scraping</p>
              </div>
            </div>
            <input
              type="text"
              defaultValue="GovtRank Bot/1.0"
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white w-48"
            />
          </div>
        </div>
      </motion.div>

      {/* API Integration Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="luxury-card bg-luxury-gold/5 border border-luxury-gold/20"
      >
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-luxury-gold mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-luxury-gold mb-2">Important Note About Web Scraping</h4>
            <p className="text-gray-300 text-sm mb-3">
              The web scraping functionality in this demo uses mock data. In production, you should:
            </p>
            <ul className="text-gray-400 text-sm space-y-1 mb-3">
              <li>• Use official APIs when available (UPSC, SSC, etc. provide APIs)</li>
              <li>• Respect robots.txt and website terms of service</li>
              <li>• Implement rate limiting to avoid being blocked</li>
              <li>• Use a dedicated scraping service or server</li>
              <li>• Consider using RSS feeds if available</li>
            </ul>
            <p className="text-gray-300 text-sm">
              For a production system, we recommend using a backend service with proper error handling and rate limiting.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default WebScraper
