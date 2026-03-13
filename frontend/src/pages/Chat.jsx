import { useState, useEffect, useRef } from 'react'
import { Layout, Input, List, Avatar, Typography, Button, Space, Badge, message, Spin } from 'antd'
import { SearchOutlined, PaperClipOutlined, SendOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { useUnread } from '../context/UnreadContext'
import { useChatWebSocketContext } from '../context/ChatWebSocketContext'
import { getConversations, getOrCreateConversation, getMessages, sendMessage, markConversationRead } from '../api/chat'
import { getConnections } from '../api/connections'
import { discoverUsers } from '../api/users'
import { getProfileByUserId } from '../api/users'
import './Chat.css'

const { Sider, Content } = Layout
const { Text, Title } = Typography

function Chat() {
  const { user } = useAuth()
  const { refreshUnread } = useUnread()
  const [conversations, setConversations] = useState([])
  const [userNames, setUserNames] = useState({})
  const [connections, setConnections] = useState([])
  const [discoverList, setDiscoverList] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputVal, setInputVal] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')
  const userNamesRef = useRef({})
  userNamesRef.current = userNames

  const { subscribe, setActiveConversationId, setSenderNameResolver } = useChatWebSocketContext()

  useEffect(() => {
    loadData()
  }, [user?.id])

  useEffect(() => {
    setActiveConversationId(activeConversation?.id ?? null)
    return () => setActiveConversationId(null)
  }, [activeConversation?.id, setActiveConversationId])

  useEffect(() => {
    setSenderNameResolver(id => userNamesRef.current[id] || `User ${id}`)
    return () => setSenderNameResolver(null)
  }, [setSenderNameResolver])

  // Subscribe to WebSocket for active conversation (real-time message display)
  useEffect(() => {
    if (!activeConversation?.id || !user?.id) return
    const handleNewMessage = (msg) => {
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev
        return [...prev, { ...msg, senderId: msg.senderId }]
      })
      setConversations(prev =>
        prev.map(c =>
          c.id === msg.conversationId
            ? { ...c, lastMessagePreview: (msg.content || '').slice(0, 80), lastMessageAt: msg.createdAt }
            : c
        )
      )
    }
    return subscribe(activeConversation.id, handleNewMessage)
  }, [activeConversation?.id, user?.id, subscribe])

  // Poll conversation list every 5 seconds (for new messages from others)
  useEffect(() => {
    if (!user?.id) return
    const interval = setInterval(() => {
      getConversations().then(convs => {
        if (Array.isArray(convs)) setConversations(convs)
      }).catch(() => {})
    }, 5000)
    return () => clearInterval(interval)
  }, [user?.id])

  const loadData = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const [convs, conns, discover] = await Promise.all([
        getConversations().catch(() => []),
        getConnections(user.id).catch(() => []),
        discoverUsers().catch(() => []),
      ])
      setConversations(Array.isArray(convs) ? convs : [])
      setConnections(Array.isArray(conns) ? conns : [])
      setDiscoverList(Array.isArray(discover) ? discover : [])

      const ids = new Set()
      convs?.forEach(c => {
        if (c.otherUserId) ids.add(c.otherUserId)
      })
      conns?.forEach(c => ids.add(c.userId))
      discover?.forEach(u => u?.id && ids.add(u.id))
      const names = { [user.id]: user.name }
      await Promise.all(
        [...ids].map(async id => {
          try {
            const p = await getProfileByUserId(id)
            if (p?.name) names[id] = p.name
          } catch {
            names[id] = `User ${id}`
          }
        })
      )
      setUserNames(names)
    } catch (err) {
      message.error(err.body || err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeConversation) loadMessages(activeConversation.id)
  }, [activeConversation?.id])

  // Fallback poll every 15s (WebSocket handles real-time)
  useEffect(() => {
    if (!activeConversation) return
    const interval = setInterval(() => {
      loadMessages(activeConversation.id)
      getConversations().then(convs => {
        setConversations(prev => {
          const byId = Object.fromEntries((convs || []).map(c => [c.id, c]))
          return prev.map(c => byId[c.id] ? { ...c, ...byId[c.id] } : c)
        })
      }).catch(() => {})
    }, 15000)
    return () => clearInterval(interval)
  }, [activeConversation?.id])

  const loadMessages = async (conversationId) => {
    if (!conversationId) return
    try {
      const msgs = await getMessages(conversationId)
      setMessages(Array.isArray(msgs) ? msgs.reverse() : [])
    } catch (err) {
      message.error(err.body || err.message || 'Failed to load messages')
      setMessages([])
    }
  }

  const handleSelectConversation = (conv) => {
    setActiveConversation(conv)
    if (conv?.id) {
      markConversationRead(conv.id).catch(() => {}).then(() => refreshUnread())
      setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c))
    }
  }

  const handleStartChat = async (otherUserId) => {
    try {
      const conv = await getOrCreateConversation(otherUserId)
      setActiveConversation(conv)
      setConversations(prev => {
        const exists = prev.some(c => c.id === conv.id)
        if (exists) return prev
        return [{ ...conv, otherUserId }, ...prev]
      })
      if (!userNames[otherUserId]) {
        try {
          const p = await getProfileByUserId(otherUserId)
          setUserNames(n => ({ ...n, [otherUserId]: p?.name || `User ${otherUserId}` }))
        } catch {}
      }
    } catch (err) {
      message.error(err.body || err.message || 'Failed to start chat')
    }
  }

  const handleSend = async () => {
    const content = inputVal?.trim()
    if (!content || !activeConversation || sending) return
    setSending(true)
    try {
      const msg = await sendMessage(activeConversation.id, content)
      setMessages(prev => [...prev, { ...msg, senderId: msg.senderId }])
      setInputVal('')
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConversation.id
            ? { ...c, lastMessagePreview: content.slice(0, 80), lastMessageAt: msg.createdAt }
            : c
        )
      )
    } catch (err) {
      message.error(err.body || err.message || 'Failed to send')
    } finally {
      setSending(false)
    }
  }

  const otherName = activeConversation
    ? userNames[activeConversation.otherUserId] || `User ${activeConversation.otherUserId}`
    : ''
  const otherInitials = otherName
    ? otherName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const filteredConvs = conversations.filter(
    c =>
      !search ||
      (userNames[c.otherUserId] || '').toLowerCase().includes(search.toLowerCase())
  )
  const connIds = new Set(connections.map(c => c.userId))
  const convUserIds = new Set(conversations.map(c => c.otherUserId))
  const startChatUsers = [
    ...connections.filter(c => !convUserIds.has(c.userId)).map(c => ({ userId: c.userId })),
    ...discoverList.filter(u => u?.id && u.id !== user?.id && !connIds.has(u.id) && !convUserIds.has(u.id)).map(u => ({ userId: u.id })),
  ]
  const filteredStartChat = startChatUsers.filter(
    item =>
      !search ||
      (userNames[item.userId] || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <Layout className="chat-page">
      <Sider width={320} theme="light" className="chat-sidebar">
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
          <Input
            prefix={<SearchOutlined style={{ color: 'var(--text-secondary)' }} />}
            placeholder="Search conversations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            variant="filled"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </div>

        <List
          className="chat-list"
          itemLayout="horizontal"
          dataSource={filteredConvs}
          renderItem={item => (
            <List.Item
              onClick={() => handleSelectConversation(item)}
              className={`chat-item ${activeConversation?.id === item.id ? 'active' : ''}`}
            >
              <List.Item.Meta
                avatar={
                  <Badge count={item.unreadCount || 0} color="var(--primary)">
                    <Avatar size={48} style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600 }}>
                      {(userNames[item.otherUserId] || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </Avatar>
                  </Badge>
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>{userNames[item.otherUserId] || `User ${item.otherUserId}`}</Text>
                  </div>
                }
                description={
                  <Text type="secondary" ellipsis style={{ maxWidth: 200 }}>
                    {item.lastMessagePreview || 'No messages yet'}
                  </Text>
                }
              />
            </List.Item>
          )}
        />

        {filteredStartChat.length > 0 && (
          <>
            <div style={{ padding: '12px 24px', fontWeight: 600, fontSize: 14, color: 'var(--text-secondary)' }}>
              Start new chat
            </div>
            <List
              className="chat-list"
              itemLayout="horizontal"
              dataSource={filteredStartChat.slice(0, 10)}
              renderItem={item => (
                <List.Item onClick={() => handleStartChat(item.userId)} style={{ cursor: 'pointer' }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar size={40} style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600 }}>
                        {(userNames[item.userId] || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </Avatar>
                    }
                    title={<Text strong>{userNames[item.userId] || `User ${item.userId}`}</Text>}
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </Sider>

      <Layout className="chat-main" style={{ background: 'var(--bg-card)' }}>
        <Content style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {activeConversation ? (
            <>
              <div className="chat-header">
                <Space align="center" size="middle">
                  <Avatar size={44} style={{ backgroundColor: 'var(--primary)' }}>
                    {otherInitials}
                  </Avatar>
                  <div>
                    <Title level={5} style={{ margin: 0 }}>{otherName}</Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>Connected</Text>
                  </div>
                </Space>
              </div>

              <div className="chat-messages">
                {messages.map(m => (
                  <div
                    key={m.id}
                    className={`chat-msg ${m.senderId === user?.id ? 'me' : 'them'}`}
                  >
                    <div className="chat-msg-bubble">
                      <Text style={{ color: m.senderId === user?.id ? 'white' : 'inherit' }}>
                        {m.content}
                      </Text>
                      <span className="chat-msg-time">
                        {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chat-input-area">
                <Button type="text" icon={<PaperClipOutlined />} size="large" />
                <Input
                  size="large"
                  placeholder="Type a message..."
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onPressEnter={handleSend}
                  style={{ borderRadius: 24 }}
                />
                <Button
                  type="primary"
                  shape="round"
                  icon={<SendOutlined />}
                  size="large"
                  onClick={handleSend}
                  loading={sending}
                  disabled={!inputVal?.trim()}
                >
                  Send
                </Button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <Text>Select a conversation or start a new chat with a connection</Text>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  )
}

export default Chat
