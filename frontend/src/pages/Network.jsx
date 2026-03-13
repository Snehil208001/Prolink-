import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Button, Input, message, Spin } from 'antd'
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { discoverUsers } from '../api/users'
import { getConnections, getReceivedRequests, getSentRequests, sendConnectionRequest } from '../api/connections'
import './Network.css'

function Network() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [connections, setConnections] = useState([])
  const [receivedIds, setReceivedIds] = useState(new Set())
  const [sentIds, setSentIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState({})
  const [search, setSearch] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const [discover, conns, recv, sent] = await Promise.all([
        discoverUsers(),
        user?.id ? getConnections(user.id).catch(() => []) : Promise.resolve([]),
        getReceivedRequests().catch(() => []),
        getSentRequests().catch(() => [])
      ])
      setUsers(Array.isArray(discover) ? discover : [])
      setConnections(Array.isArray(conns) ? conns : [])
      setReceivedIds(new Set(recv.filter(r => r.status === 'PENDING').map(r => r.senderId)))
      setSentIds(new Set(sent.filter(r => r.status === 'PENDING').map(r => r.receiverId)))
    } catch (err) {
      message.error(err.body || err.message || 'Failed to load network')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user?.id])

  const handleConnect = async (userId) => {
    setConnecting(prev => ({ ...prev, [userId]: true }))
    try {
      await sendConnectionRequest(userId)
      message.success('Connection request sent')
      setSentIds(prev => new Set([...prev, userId]))
    } catch (err) {
      message.error(err.body || err.message || 'Failed to send request')
    } finally {
      setConnecting(prev => ({ ...prev, [userId]: false }))
    }
  }

  const connectionIds = new Set(connections.map(c => c.userId))
  const filteredUsers = users
    .filter(u => !connectionIds.has(u.id))
    .filter(u => {
      const matchSearch = !search || 
        (u.name?.toLowerCase().includes(search.toLowerCase())) ||
        (u.email?.toLowerCase().includes(search.toLowerCase()))
      return matchSearch
    })

  const getConnectionStatus = (userId) => {
    if (connectionIds.has(userId)) return 'connected'
    if (sentIds.has(userId)) return 'pending'
    if (receivedIds.has(userId)) return 'received'
    return 'none'
  }

  const initials = (u) => u?.name ? u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'

  if (loading) {
    return (
      <div className="network-page" style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="network-page">
      <div className="network-header">
        <h1 className="network-title">Grow your network</h1>
        <p className="network-subtitle">Connect with professionals on ProLink</p>
        <div className="network-search">
          <Input
            placeholder="Search by name or email..."
            prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="large"
            allowClear
          />
        </div>
      </div>

      <div className="network-grid">
        {filteredUsers.length === 0 ? (
          <div className="network-empty">
            <p>No users to connect with yet.</p>
          </div>
        ) : (
          filteredUsers.map(u => {
            const status = getConnectionStatus(u.id)
            return (
              <div key={u.id} className="network-card">
                <Link to={`/profile/${u.id}`} style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', color: 'inherit', flex: 1, minWidth: 0, width: '100%', justifyContent: 'center' }}>
                  <Avatar size={64} style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600 }}>
                    {initials(u)}
                  </Avatar>
                  <div className="network-card-info">
                    <h3 className="network-card-name">{u.name || 'User'}</h3>
                    <p className="network-card-email">{u.email || ''}</p>
                  </div>
                </Link>
                <div className="network-card-action" onClick={e => e.stopPropagation()}>
                  {status === 'connected' && (
                    <Button disabled size="large">Connected</Button>
                  )}
                  {status === 'pending' && (
                    <Button disabled size="large">Pending</Button>
                  )}
                  {status === 'received' && (
                    <Button disabled size="large">Respond to request</Button>
                  )}
                  {status === 'none' && (
                    <Button
                      type="primary"
                      size="large"
                      icon={<UserAddOutlined />}
                      loading={connecting[u.id]}
                      onClick={() => handleConnect(u.id)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Network
