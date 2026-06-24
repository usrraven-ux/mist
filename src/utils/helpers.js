import { format, parseISO, isBefore, isAfter, differenceInDays } from 'date-fns'

// Format date
export const formatDate = (dateString, formatStr = 'dd MMM yyyy') => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
    return format(date, formatStr)
  } catch {
    return dateString
  }
}

// Format date with relative time
export const formatRelativeDate = (dateString) => {
  const date = parseISO(dateString)
  const now = new Date()
  const diffInDays = differenceInDays(now, date)
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return `${Math.floor(diffInDays / 365)} years ago`
}

// Check if job is still open
export const isJobOpen = (lastDate) => {
  const date = parseISO(lastDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return isAfter(date, today) || isBefore(date, today) === false
}

// Get days remaining
export const getDaysRemaining = (lastDate) => {
  const date = parseISO(lastDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const diff = differenceInDays(date, today)
  
  if (diff < 0) return 'Closed'
  if (diff === 0) return 'Last day'
  if (diff === 1) return '1 day left'
  return `${diff} days left`
}

// Truncate text
export const truncate = (text, length = 100) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Format salary range
export const formatSalary = (salary) => {
  if (!salary) return 'Not disclosed'
  if (salary.includes('₹')) return salary
  return `₹${salary}`
}

// Format number with commas
export const formatNumber = (num) => {
  if (!num) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Get initials from name
export const getInitials = (name) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// Generate unique ID
export const generateId = () => {
  return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// Debounce function
export const debounce = (func, wait = 300) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Slugify string
export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Get state code from name
export const getStateCode = (stateName) => {
  const stateCodes = {
    'Andhra Pradesh': 'AP',
    'Arunachal Pradesh': 'AR',
    'Assam': 'AS',
    'Bihar': 'BR',
    'Chhattisgarh': 'CG',
    'Goa': 'GA',
    'Gujarat': 'GJ',
    'Haryana': 'HR',
    'Himachal Pradesh': 'HP',
    'Jharkhand': 'JH',
    'Karnataka': 'KA',
    'Kerala': 'KL',
    'Madhya Pradesh': 'MP',
    'Maharashtra': 'MH',
    'Manipur': 'MN',
    'Meghalaya': 'ML',
    'Mizoram': 'MZ',
    'Nagaland': 'NL',
    'Odisha': 'OD',
    'Punjab': 'PB',
    'Rajasthan': 'RJ',
    'Sikkim': 'SK',
    'Tamil Nadu': 'TN',
    'Telangana': 'TS',
    'Tripura': 'TR',
    'Uttar Pradesh': 'UP',
    'Uttarakhand': 'UK',
    'West Bengal': 'WB',
    'Delhi NCR': 'DL',
    'Jammu & Kashmir': 'JK',
  }
  return stateCodes[stateName] || stateName.slice(0, 2).toUpperCase()
}

// Get category icon
export const getCategoryIcon = (category) => {
  const icons = {
    'Medical': 'heart',
    'Engineering': 'settings',
    'Police / Defense': 'shield',
    'Banking': 'bank',
    'Railway': 'train',
    'Nursing': 'user-check',
    'Pharmacy': 'pill',
    'Post Office': 'mail',
    'Teaching': 'book',
    'Law / Judiciary': 'scales',
    'Agriculture': 'leaf',
    'Hotel Management': 'coffee',
    'Aviation': 'plane',
    'Scientist': 'flask',
    'PSU / Govt': 'building',
    'Sports Quota': 'award',
    'Apprentice': 'user-plus',
    'Clerk / Assistant': 'file-text',
    'Forest / Environment': 'tree'
  }
  return icons[category] || 'briefcase'
}

// Get qualification level
export const getQualificationLevel = (qualification) => {
  const levels = {
    '10th Pass': 1,
    '12th Pass': 2,
    'ITI': 2,
    'Diploma': 3,
    'Graduate': 4,
    'B.Tech / B.E': 4,
    'B.Sc': 4,
    'B.Com': 4,
    'B.Ed': 4,
    'LLB': 4,
    'MBBS / BDS': 5,
    'Post Graduate': 5,
    'M.Tech': 5,
    'M.Sc': 5,
    'M.Com': 5,
    'MBA': 5,
    'CA': 5,
    'PhD': 6,
    'M.Phil': 6,
    'MD': 6,
    'MS': 6,
    'DNB': 6,
  }
  return levels[qualification] || 3
}

// Sort jobs by relevance
export const sortJobs = (jobs, sortBy = 'latest') => {
  const sorted = [...jobs]
  
  switch (sortBy) {
    case 'latest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'closing-soon':
      return sorted.sort((a, b) => {
        const aDays = differenceInDays(parseISO(a.lastDate), new Date())
        const bDays = differenceInDays(parseISO(b.lastDate), new Date())
        return aDays - bDays
      })
    case 'salary-high':
      return sorted.sort((a, b) => {
        const aSalary = parseSalary(a.salary)
        const bSalary = parseSalary(b.salary)
        return bSalary - aSalary
      })
    case 'posts-high':
      return sorted.sort((a, b) => b.posts - a.posts)
    case 'a-z':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return sorted
  }
}

// Parse salary string to number
export const parseSalary = (salary) => {
  if (!salary) return 0
  const match = salary.match(/₹?\s*(\d+[,\d]*)/)
  if (match) {
    return parseInt(match[1].replace(/,/g, ''))
  }
  return 0
}

// Filter options for dropdowns
export const getFilterOptions = (items, key = 'name') => {
  return items.map(item => ({
    value: typeof item === 'string' ? item : item[key] || item.id,
    label: typeof item === 'string' ? item : item[key] || item.name || item.id
  }))
}
