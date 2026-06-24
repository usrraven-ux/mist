import React from 'react'
import { motion } from 'framer-motion'
import { X, Home, Briefcase, Bookmark, Bell, User, Settings, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Sidebar({ navItems, onClose }) {
  const navigate = useNavigate()

  const handleNavigate = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed left-0 top-0 bottom-0 w-72 bg-luxury-deep border-r border-white/10 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-xl flex items-center justify-center">
            <span className="text-luxury-deep font-bold">GR</span>
          </div>
          <div>
            <h2 className="font-bold text-white">GovtRank</h2>
            <p className="text-xs text-gray-400">Luxury Edition</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col h-[calc(100%-180px)] overflow-y-auto hide-scrollbar">
        <div className="p-4 space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 px-4">Main Menu</p>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="sidebar-link w-full text-left"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
              {item.badge > 0 && (
                <span className="ml-auto bg-luxury-gold text-luxury-deep text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="p-4 space-y-2 border-t border-white/10">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 px-4">Quick Actions</p>
          <button className="sidebar-link w-full text-left">
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span>Settings</span>
          </button>
          <button className="sidebar-link w-full text-left">
            <Bell className="w-5 h-5 flex-shrink-0" />
            <span>Notification Settings</span>
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
        <button className="sidebar-link w-full text-left">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-500 text-center">
            © 2026 GovtRank Luxury
          </p>
          <p className="text-xs text-gray-600 text-center mt-1">
            Premium Government Job Portal
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar
