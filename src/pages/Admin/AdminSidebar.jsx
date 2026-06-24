import React from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Bell, 
  BarChart3,
  Scraper,
  Database,
  LogOut
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AdminSidebar({ activeTab, onTabChange }) {
  const navigate = useNavigate()

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { id: 'jobs', icon: FileText, label: 'Job Listings', path: '/admin/jobs' },
    { id: 'users', icon: Users, label: 'Users', path: '/admin/users' },
    { id: 'scraper', icon: Scraper, label: 'Web Scraper', path: '/admin/scraper' },
    { id: 'database', icon: Database, label: 'Database', path: '/admin/database' },
    { id: 'notifications', icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/admin/settings' },
  ]

  const handleNavigate = (path) => {
    navigate(path)
    onTabChange(path.replace('/admin/', ''))
  }

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="w-64 bg-luxury-deep border-r border-white/10 h-screen sticky top-0"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-xl flex items-center justify-center">
            <span className="text-luxury-deep font-bold">GR</span>
          </div>
          <div>
            <h2 className="font-bold text-white">GovtRank</h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 px-4">Main Menu</p>
        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-luxury-gold/10 text-luxury-gold'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Go to Main Site</span>
        </button>
        
        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors mt-2">
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.aside>
  )
}

export default AdminSidebar
