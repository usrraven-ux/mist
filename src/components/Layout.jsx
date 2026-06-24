import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Bell, Heart, User, Search, Home, Briefcase, Bookmark, Settings } from 'lucide-react'
import { useJobs } from '../context/JobContext'
import { useNotifications } from '../context/NotificationContext'
import NotificationDropdown from './NotificationDropdown'
import MobileNav from './MobileNav'
import Sidebar from './Sidebar'
import SearchBar from './SearchBar'

function Layout() {
  const location = useLocation()
  const { unreadCount } = useNotifications()
  const { savedJobs } = useJobs()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsSidebarOpen(false)
    setIsSearchOpen(false)
  }, [location])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  // Navigation items
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/saved', icon: Bookmark, label: 'Saved', badge: savedJobs.length },
    { path: '/notifications', icon: Bell, label: 'Alerts', badge: unreadCount },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-deeper via-luxury-deep to-gray-900">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-luxury-deep/90 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-xl opacity-90" />
                <div className="relative z-10 text-luxury-deep font-bold text-xl">GR</div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white group-hover:text-luxury-gold transition-colors">GovtRank</span>
                <span className="text-xs text-gray-400 -mt-1 hidden sm:block">Luxury Edition</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className={`nav-link relative ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-luxury-gold text-luxury-deep text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Search Toggle */}
              <button
                onClick={toggleSearch}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors lg:hidden"
              >
                <Search className="w-5 h-5 text-gray-300" />
              </button>

              {/* Notification Bell */}
              <button
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors relative hidden sm:flex"
              >
                <Bell className="w-5 h-5 text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-luxury-gold rounded-full animate-pulse" />
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors lg:hidden"
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5 text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden pb-4"
            >
              <SearchBar onClose={toggleSearch} />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={toggleSidebar}
            />
            <Sidebar navItems={navItems} onClose={toggleSidebar} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav navItems={navItems} />

      {/* Notification Dropdown */}
      <NotificationDropdown />
    </div>
  )
}

export default Layout
