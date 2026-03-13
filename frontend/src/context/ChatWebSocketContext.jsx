/**
 * Chat WebSocket context - connects when user is logged in, subscribes to all conversations.
 * Enables real-time messages and notifications (browser + sound) even when on Feed/Profile.
 */

import { createContext, useContext, useEffect, useRef, useCallback } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { useAuth } from './AuthContext'
import { useUnread } from './UnreadContext'
import { getConversations } from '../api/chat'
import { requestNotificationPermission, showMessageNotification, playNotificationSound } from '../utils/notifications'

function getWsUrl() {
  const base = `${window.location.origin}/api/v1/chat`
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('prolink-token') : null
  return token ? `${base}/ws?token=${encodeURIComponent(token)}` : `${base}/ws`
}

const ChatWebSocketContext = createContext(null)

export function ChatWebSocketProvider({ children }) {
  const { user } = useAuth()
  const { refreshUnread } = useUnread()
  const clientRef = useRef(null)
  const subscriptionsRef = useRef(new Map())
  const activeConversationIdRef = useRef(null)
  const senderNameResolverRef = useRef(() => null)

  const setActiveConversationId = useCallback((id) => {
    activeConversationIdRef.current = id
  }, [])

  const setSenderNameResolver = useCallback((fn) => {
    senderNameResolverRef.current = fn || (() => null)
  }, [])

  const subscribe = useCallback((conversationId, callback) => {
    if (!conversationId || !callback) return () => {}
    const topic = `/topic/conversations/${conversationId}`
    const existing = subscriptionsRef.current.get(conversationId)
    if (existing) {
      existing.callbacks.add(callback)
      return () => {
        existing.callbacks.delete(callback)
        if (existing.callbacks.size === 0) {
          existing.unsubscribe?.()
          subscriptionsRef.current.delete(conversationId)
        }
      }
    }
    const callbacks = new Set([callback])
    subscriptionsRef.current.set(conversationId, { callbacks })

    const doSubscribe = () => {
      const c = clientRef.current
      if (!c?.connected) return
      const sub = c.subscribe(topic, (frame) => {
        try {
          const body = JSON.parse(frame.body)
          callbacks.forEach(cb => cb(body))
        } catch {}
      })
      subscriptionsRef.current.get(conversationId).unsubscribe = () => sub.unsubscribe()
    }

    if (clientRef.current?.connected) {
      doSubscribe()
    }

    return () => {
      callbacks.delete(callback)
      if (callbacks.size === 0) {
        subscriptionsRef.current.get(conversationId)?.unsubscribe?.()
        subscriptionsRef.current.delete(conversationId)
      }
    }
  }, [])

  useEffect(() => {
    if (!user?.id) return
    requestNotificationPermission()
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) return

    const handleMessage = (msg, convId) => {
      const fromOther = msg.senderId !== user.id
      const viewingThis = activeConversationIdRef.current === msg.conversationId
      const shouldNotify = fromOther && (!viewingThis || document.hidden)
      if (shouldNotify) {
        refreshUnread()
        const name = senderNameResolverRef.current?.(msg.senderId) || `User ${msg.senderId}`
        showMessageNotification(name, msg.content)
        playNotificationSound()
      }
      const subs = subscriptionsRef.current.get(convId)
      if (subs?.callbacks) {
        subs.callbacks.forEach(cb => cb(msg))
      }
    }

    const ensureSubscribed = (convId) => {
      const existing = subscriptionsRef.current.get(convId)
      if (existing?.unsubscribe) return
      const topic = `/topic/conversations/${convId}`
      const callbacks = existing?.callbacks || new Set()
      if (!existing) subscriptionsRef.current.set(convId, { callbacks })
      if (clientRef.current?.connected) {
        const sub = clientRef.current.subscribe(topic, (frame) => {
          try {
            const body = JSON.parse(frame.body)
            handleMessage(body, convId)
          } catch {}
        })
        subscriptionsRef.current.get(convId).unsubscribe = () => sub.unsubscribe()
      }
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(getWsUrl()),
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {},
      onConnect: () => {
        subscriptionsRef.current.forEach((_, convId) => {
          ensureSubscribed(convId)
        })
      },
      onStompError: () => {},
    })

    clientRef.current = client
    client.activate()

    const pollAndSubscribe = () => {
      getConversations()
        .then(convs => {
          (convs || []).forEach(c => {
            if (c?.id) ensureSubscribed(c.id)
          })
        })
        .catch(() => {})
    }

    pollAndSubscribe()
    const interval = setInterval(pollAndSubscribe, 30000)

    return () => {
      clearInterval(interval)
      client.deactivate()
      clientRef.current = null
      subscriptionsRef.current.clear()
    }
  }, [user?.id, refreshUnread])

  const value = {
    subscribe,
    setActiveConversationId,
    setSenderNameResolver,
  }

  return (
    <ChatWebSocketContext.Provider value={value}>
      {children}
    </ChatWebSocketContext.Provider>
  )
}

export function useChatWebSocketContext() {
  const ctx = useContext(ChatWebSocketContext)
  if (!ctx) throw new Error('useChatWebSocketContext must be used within ChatWebSocketProvider')
  return ctx
}
