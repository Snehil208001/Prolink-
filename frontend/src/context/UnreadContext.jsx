import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getConversations } from '../api/chat'
import { useAuth } from './AuthContext'

const UnreadContext = createContext(null)

export function UnreadProvider({ children }) {
  const { user } = useAuth()
  const [totalUnread, setTotalUnread] = useState(0)

  const refreshUnread = useCallback(async () => {
    if (!user?.id) return
    try {
      const convs = await getConversations()
      const total = (convs || []).reduce((sum, c) => sum + (c.unreadCount || 0), 0)
      setTotalUnread(total)
    } catch {
      setTotalUnread(0)
    }
  }, [user?.id])

  useEffect(() => {
    refreshUnread()
    const interval = setInterval(refreshUnread, 10000)
    return () => clearInterval(interval)
  }, [refreshUnread])

  return (
    <UnreadContext.Provider value={{ totalUnread, refreshUnread }}>
      {children}
    </UnreadContext.Provider>
  )
}

export function useUnread() {
  const ctx = useContext(UnreadContext)
  if (!ctx) throw new Error('useUnread must be used within UnreadProvider')
  return ctx
}
