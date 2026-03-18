import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getUnreadCount } from '../api/notifications'
import { useAuth } from './AuthContext'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  const refreshUnread = useCallback(async () => {
    if (!user?.id) return
    try {
      const count = await getUnreadCount()
      setUnreadCount(typeof count === 'number' ? count : 0)
    } catch {
      setUnreadCount(0)
    }
  }, [user?.id])

  useEffect(() => {
    refreshUnread()
    const interval = setInterval(refreshUnread, 15000)
    return () => clearInterval(interval)
  }, [refreshUnread])

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnread }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
