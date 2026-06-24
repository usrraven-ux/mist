import React, { createContext, useContext, useState, useEffect } from 'react'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [pushPermission, setPushPermission] = useState('default')

  useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('govtrank_notifications')
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications)
      setNotifications(parsed)
      setUnreadCount(parsed.filter(n => !n.read).length)
    }
    
    // Check push notification permission
    if ('Notification' in window) {
      setPushPermission(Notification.permission)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('govtrank_notifications', JSON.stringify(notifications))
    setUnreadCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  const addNotification = (notification) => {
    setNotifications(prev => [
      { 
        ...notification, 
        id: Date.now(), 
        read: false,
        createdAt: new Date().toISOString() 
      },
      ...prev
    ])
  }

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const requestPushPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission()
        setPushPermission(permission)
        return permission
      } catch (err) {
        console.error('Error requesting notification permission:', err)
        return 'denied'
      }
    }
    return 'unsupported'
  }

  const showPushNotification = (title, options) => {
    if (pushPermission === 'granted' && 'Notification' in window) {
      new Notification(title, options)
    }
  }

  const value = {
    notifications,
    unreadCount,
    pushPermission,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    requestPushPermission,
    showPushNotification,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
