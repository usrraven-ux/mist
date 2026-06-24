import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Bell, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useJobs } from '../../context/JobContext'
import AdminSidebar from './AdminSidebar'
import JobForm from './JobForm'

function AdminDashboard() {
  const navigate = useNavigate()
  const { jobs, loading } = useJobs()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isJobFormOpen, setIsJobFormOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSource, setSelectedSource] = useState('all')

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.organization.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSource = selectedSource === 'all' || job.source === selectedSource
    
    return matchesSearch && matchesSource
  })

  // Stats
  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => job.status === 'active').length,
    newJobs: jobs.filter(job => job.status === 'new').length,
    sources: [...new Set(jobs.map(job => job.source))].length
  }

  const handleAddJob = () => {
    setEditingJob(null)
    setIsJobFormOpen(true)
  }

  const handleEditJob = (job) => {
    setEditingJob(job)
    setIsJobFormOpen(true)
  }

  const handleRefresh = () => {
    // In production, this would trigger a scrape
    console.log('Refreshing job data...')
  }

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full w-12 h-12 border-4 border-luxury-gold/20 border-t-luxury-gold" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-luxury-deeper">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your job listings</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh Data</span>
            </button>
            <button
              onClick={handleAddJob}
              className="flex items-center gap-2 bg-luxury-gold hover:bg-luxury-gold-dark px-4 py-2 rounded-xl text-luxury-deep font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Job</span>
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="luxury-card text-center">
            <LayoutDashboard className="w-8 h-8 text-luxury-gold mx-auto mb-3" />
            <p className="text-2xl font-bold text-white">{stats.totalJobs}</p>
            <p className="text-sm text-gray-400">Total Jobs</p>
          </div>
          <div className="luxury-card text-center">
            <Users className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-emerald-400">{stats.activeJobs}</p>
            <p className="text-sm text-gray-400">Active Jobs</p>
          </div>
          <div className="luxury-card text-center">
            <Bell className="w-8 h-8 text-luxury-gold mx-auto mb-3" />
            <p className="text-2xl font-bold text-luxury-gold">{stats.newJobs}</p>
            <p className="text-sm text-gray-400">New Jobs</p>
          </div>
          <div className="luxury-card text-center">
            <FileText className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-purple-400">{stats.sources}</p>
            <p className="text-sm text-gray-400">Sources</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold"
            />
          </div>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold"
          >
            <option value="all">All Sources</option>
            {[...new Set(jobs.map(job => job.source))].map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </motion.div>

        {/* Jobs Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="luxury-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Job Title</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Organization</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Source</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Last Updated</th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job, index) => (
                    <motion.tr
                      key={job.id}
                      variants={itemVariants}
                      custom={index}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-luxury-gold/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-luxury-gold" />
                          </div>
                          <div>
                            <p className="font-medium text-white line-clamp-1">{job.title}</p>
                            <p className="text-xs text-gray-400">{job.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-300">{job.organization}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="badge-luxury">{job.source || 'Manual'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          job.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                          job.status === 'new' ? 'bg-luxury-gold/10 text-luxury-gold' :
                          'bg-gray-500/10 text-gray-400'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-400 text-sm">{new Date(job.updatedAt || job.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewJob(job.id)}
                            className="p-2 text-gray-400 hover:text-luxury-gold transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditJob(job)}
                            className="p-2 text-gray-400 hover:text-luxury-gold transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(job.applyLink || job.url || '#')}
                            className="p-2 text-gray-400 hover:text-luxury-gold transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <FileText className="w-12 h-12 text-gray-500" />
                        <p className="text-gray-400">No jobs found</p>
                        <button onClick={handleAddJob} className="btn-gold text-sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Job
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Job Form Modal */}
        {isJobFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-luxury-deep border border-white/10 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingJob ? 'Edit Job' : 'Add New Job'}
                </h3>
                <button
                  onClick={() => setIsJobFormOpen(false)}
                  className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <JobForm
                job={editingJob}
                onClose={() => setIsJobFormOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
