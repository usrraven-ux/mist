import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Building2, 
  Calendar, 
  DollarSign, 
  Users, 
  MapPin, 
  GraduationCap,
  Briefcase,
  Link2,
  Check,
  X
} from 'lucide-react'
import { useJobs } from '../../context/JobContext'
import { states, categories, qualifications, recruitmentBoards } from '../../utils/mockData'

function JobForm({ job, onClose }) {
  const { addJob, updateJob } = useJobs()
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    description: '',
    qualification: [],
    lastDate: '',
    state: '',
    category: '',
    board: '',
    type: 'recruitment',
    status: 'active',
    isLive: false,
    salary: '',
    posts: '',
    applyLink: '',
    notificationPdf: '',
    tags: [],
    source: 'manual'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // Initialize form with job data if editing
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        organization: job.organization || '',
        description: job.description || '',
        qualification: job.qualification || [],
        lastDate: job.lastDate || '',
        state: job.state || '',
        category: job.category || '',
        board: job.board || '',
        type: job.type || 'recruitment',
        status: job.status || 'active',
        isLive: job.isLive || false,
        salary: job.salary || '',
        posts: job.posts || '',
        applyLink: job.applyLink || '',
        notificationPdf: job.notificationPdf || '',
        tags: job.tags || [],
        source: job.source || 'manual'
      })
    }
  }, [job])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleTagChange = (e) => {
    const { value } = e.target
    setFormData(prev => ({
      ...prev,
      tags: value.split(',').map(tag => tag.trim())
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.organization.trim()) newErrors.organization = 'Organization is required'
    if (!formData.lastDate) newErrors.lastDate = 'Last date is required'
    if (!formData.state) newErrors.state = 'State is required'
    if (!formData.category) newErrors.category = 'Category is required'
    
    if (formData.posts && isNaN(formData.posts)) {
      newErrors.posts = 'Posts must be a number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const jobData = {
        ...formData,
        id: job?.id || `job-${Date.now()}`,
        createdAt: job?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      if (job) {
        // Update existing job
        await updateJob(job.id, jobData)
      } else {
        // Add new job
        await addJob(jobData)
      }
      
      onClose()
      
    } catch (error) {
      console.error('Error saving job:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Form fields
  const formFields = [
    {
      name: 'title',
      label: 'Job Title',
      type: 'text',
      icon: FileText,
      placeholder: 'e.g., SBI PO Recruitment 2026',
      required: true
    },
    {
      name: 'organization',
      label: 'Organization',
      type: 'text',
      icon: Building2,
      placeholder: 'e.g., State Bank of India',
      required: true
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      icon: FileText,
      placeholder: 'Brief description of the job...',
      rows: 3
    },
    {
      name: 'applyLink',
      label: 'Apply Link',
      type: 'url',
      icon: Link2,
      placeholder: 'https://sbi.co.in/careers'
    },
    {
      name: 'notificationPdf',
      label: 'Notification PDF URL',
      type: 'url',
      icon: FileText,
      placeholder: 'https://sbi.co.in/pdf/notification.pdf'
    }
  ]

  const selectFields = [
    {
      name: 'state',
      label: 'State/UT',
      icon: MapPin,
      options: states,
      required: true
    },
    {
      name: 'category',
      label: 'Category',
      icon: Briefcase,
      options: categories,
      required: true
    },
    {
      name: 'board',
      label: 'Recruitment Board',
      icon: Building2,
      options: recruitmentBoards
    },
    {
      name: 'type',
      label: 'Job Type',
      icon: FileText,
      options: ['recruitment', 'walkin', 'exam', 'result', 'notification']
    },
    {
      name: 'status',
      label: 'Status',
      icon: Check,
      options: ['active', 'upcoming', 'closed', 'new']
    }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <span>Basic Information</span>
        </h4>
        
        {formFields.map((field) => (
          <div key={field.name} className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <field.icon className="w-4 h-4" />
              <span>{field.label}</span>
              {field.required && <span className="text-red-400">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                rows={field.rows || 3}
                className={`w-full p-3 bg-white/5 border ${errors[field.name] ? 'border-red-400' : 'border-white/10'} rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold`}
              />
            ) : (
              <input
                type={field.type || 'text'}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={`w-full p-3 bg-white/5 border ${errors[field.name] ? 'border-red-400' : 'border-white/10'} rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold`}
              />
            )}
            {errors[field.name] && (
              <p className="text-xs text-red-400">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </motion.div>

      {/* Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <span>Job Details</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectFields.map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <field.icon className="w-4 h-4" />
                <span>{field.label}</span>
                {field.required && <span className="text-red-400">*</span>}
              </label>
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className={`w-full p-3 bg-white/5 border ${errors[field.name] ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-luxury-gold`}
              >
                <option value="">{field.label}</option>
                {field.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors[field.name] && (
                <p className="text-xs text-red-400">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <DollarSign className="w-4 h-4" />
              <span>Salary</span>
            </label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g., ₹41,960 - ₹58,920"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold"
            />
          </div>
          
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Users className="w-4 h-4" />
              <span>Total Posts</span>
            </label>
            <input
              type="number"
              name="posts"
              value={formData.posts}
              onChange={handleChange}
              placeholder="e.g., 1500"
              className={`w-full p-3 bg-white/5 border ${errors.posts ? 'border-red-400' : 'border-white/10'} rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold`}
            />
            {errors.posts && (
              <p className="text-xs text-red-400">{errors.posts}</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>Last Date</span>
            <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            name="lastDate"
            value={formData.lastDate}
            onChange={handleChange}
            className={`w-full p-3 bg-white/5 border ${errors.lastDate ? 'border-red-400' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-luxury-gold`}
          />
          {errors.lastDate && (
            <p className="text-xs text-red-400">{errors.lastDate}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <GraduationCap className="w-4 h-4" />
            <span>Qualifications</span>
          </label>
          <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-xl">
            {qualifications.map(qual => (
              <label key={qual} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="qualification"
                  value={qual}
                  checked={formData.qualification.includes(qual)}
                  onChange={handleChange}
                  className="w-4 h-4 accent-luxury-gold"
                />
                <span className="text-sm text-gray-300">{qual}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <span>🏷️</span>
            <span>Tags</span>
          </label>
          <input
            type="text"
            value={formData.tags.join(', ')}
            onChange={handleTagChange}
            placeholder="e.g., Banking, PO, Graduate, Across India"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold"
          />
          <p className="text-xs text-gray-500">Separate tags with commas</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isLive"
            checked={formData.isLive}
            onChange={handleChange}
            className="w-4 h-4 accent-luxury-gold"
          />
          <label className="text-sm text-gray-300">Mark as Live Update</label>
        </div>
      </motion.div>

      {/* Submit Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 pt-4 border-t border-white/10"
      >
        <button
          type="button"
          onClick={onClose}
          className="flex-1 btn-gold-outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 btn-gold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full w-5 h-5 border-2 border-luxury-deep border-t-transparent" />
          ) : (
            <Check className="w-5 h-5" />
          )}
          <span>{job ? 'Update Job' : 'Add Job'}</span>
        </button>
      </motion.div>
    </form>
  )
}

export default JobForm
