import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Check, X, AlertCircle, Settings, Trash2 } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext'
import { formatRelativeDate } from '../utils/helpers'

function Notification() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    requestPushPermission,
    pushPermission
  } = useNotifications()
  
  const [activeTab, setActiveTab] = useState('all')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Filter notifications
  const allNotifications = notifications
  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)

  const displayedNotifications = activeTab === 'all' 
    ? allNotifications 
    : activeTab === 'unread' 
      ? unreadNotifications 
      : readNotifications

  // Handle push permission
  const handleEnablePush = async () => {
    const permission = await requestPushPermission()
    if (permission === 'granted') {
      // Show success notification
      console.log('Push notifications enabled')
    }
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Notifications</h1>
          <p className="text-gray-400">{notifications.length} notifications</p>
        </div>
        
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2"
      >
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'all'
              ? 'bg-luxury-gold text-luxury-deep'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all relative ${
            activeTab === 'unread'
              ? 'bg-luxury-gold text-luxury-deep'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-white/20 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('read')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'read'
              ? 'bg-luxury-gold text-luxury-deep'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          Read
        </button>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2"
      >
        <button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-5 h-5" />
          <span>Mark All as Read</span>
        </button>
        <button
          onClick={clearNotifications}
          disabled={notifications.length === 0}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-5 h-5" />
          <span>Clear All</span>
        </button>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {displayedNotifications.length > 0 ? (
          displayedNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              variants={itemVariants}
              custom={index}
              className={`notification-card ${notification.read ? 'opacity-70' : ''}`}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                notification.read 
                  ? 'bg-gray-600/10' 
                  : 'bg-luxury-gold/10'
              }`}>
                {notification.read ? (
                  <Check className="w-5 h-5 text-gray-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-luxury-gold" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm line-clamp-1">
                  {notification.title}
                </h4>
                <p className="text-gray-400 text-sm mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {formatRelativeDate(notification.createdAt)}
                </p>
              </div>
              
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center hover:bg-luxury-gold/20 transition-colors"
                >
                  <Check className="w-4 h-4 text-luxury-gold" />
                </button>
              )}
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Notifications</h2>
            <p className="text-gray-400">
              {activeTab === 'all' 
                ? 'You have no notifications yet' 
                : activeTab === 'unread' 
                  ? 'All notifications have been read' 
                  : 'No read notifications'}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-luxury-deep border border-white/10 rounded-3xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Notification Settings</h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-luxury-gold" />
                  <div>
                    <p className="font-medium text-white">Push Notifications</p>
                    <p className="text-xs text-gray-400">Get notified on your device</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  pushPermission === 'granted'
                    ? 'border-luxury-gold bg-luxury-gold'
                    : 'border-gray-500 bg-transparent'
                }`}>
                  {pushPermission === 'granted' && <Check className="w-4 h-4 text-luxury-deep" />}
                </div>
              </div>

              {pushPermission !== 'granted' && (
                <button
                  onClick={handleEnablePush}
                  className="w-full btn-gold flex items-center justify-center gap-2"
                >
                  <Bell className="w-5 h-5" />
                  <span>Enable Push Notifications</span>
                </button>
              )}

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-luxury-gold" />
                  <div>
                    <p className="font-medium text-white">Email Notifications</p>
                    <p className="text-xs text-gray-400">Receive email alerts</p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-luxury-gold bg-luxury-gold flex items-center justify-center">
                  <Check className="w-4 h-4 text-luxury-deep" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-luxury-gold" />
                  <div>
                    <p className="font-medium text-white">Sound Alerts</p>
                    <p className="text-xs text-gray-400">Play sound for new notifications</p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-luxury-gold bg-luxury-gold flex items-center justify-center">
                  <Check className="w-4 h-4 text-luxury-deep" />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="btn-gold-outline"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Notification
