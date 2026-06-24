import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, X, AlertCircle } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext'
import { formatRelativeDate } from '../utils/helpers'

function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  const handleClearAll = () => {
    clearNotifications()
  }

  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors relative"
      >
        <Bell className="w-5 h-5 text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-luxury-gold text-luxury-deep text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 max-w-sm bg-luxury-deep border border-white/10 rounded-2xl shadow-luxury-lg overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-luxury-gold" />
                <div>
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <p className="text-xs text-gray-400">{notifications.length} new updates</p>
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-luxury-gold hover:text-luxury-gold-dark transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto hide-scrollbar">
              {/* Unread Notifications */}
              {unreadNotifications.length > 0 && (
                <div className="p-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-4">New</p>
                  {unreadNotifications.map((notification) => (
                    <motion.button
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className="notification-card w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: notification.id * 0.1 }}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-luxury-gold/10 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-luxury-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm line-clamp-1">{notification.title}</h4>
                        <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{notification.message}</p>
                        <p className="text-gray-500 text-xs mt-1">{formatRelativeDate(notification.createdAt)}</p>
                      </div>
                      <div className="flex-shrink-0 w-3 h-3 bg-luxury-gold rounded-full" />
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Read Notifications */}
              {readNotifications.length > 0 && (
                <div className="p-2 border-t border-white/10">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-4">Earlier</p>
                  {readNotifications.slice(0, 5).map((notification) => (
                    <motion.button
                      key={notification.id}
                      className="notification-card w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors opacity-70"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + notification.id * 0.1 }}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-600/10 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-300 text-sm line-clamp-1">{notification.title}</h4>
                        <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{notification.message}</p>
                        <p className="text-gray-600 text-xs mt-1">{formatRelativeDate(notification.createdAt)}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {notifications.length === 0 && (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-50" />
                  <p className="text-gray-400 text-sm">No notifications yet</p>
                  <p className="text-gray-500 text-xs mt-1">We'll notify you when new jobs are posted</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 flex justify-between items-center">
              <button
                onClick={handleClearAll}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-luxury-gold hover:text-luxury-gold-dark transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationDropdown
