import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Avatar, Button, Typography, message, Spin, Modal, Form, Input } from 'antd'
import { LinkOutlined, UserAddOutlined, EditOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import { getProfile, getProfileByUserId, discoverUsers, updateProfile } from '../api/users'
import {
  getConnections,
  getReceivedRequests,
  getSentRequests,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest
} from '../api/connections'
import { getFeed, getPostsByUser } from '../api/posts'
import './Profile.css'

const { Text } = Typography

function Profile() {
  const { userId: paramUserId } = useParams()
  const { user: authUser, loadUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [connections, setConnections] = useState([])
  const [posts, setPosts] = useState([])
  const [receivedRequests, setReceivedRequests] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [userNames, setUserNames] = useState({})
  const [discoverUsersList, setDiscoverUsersList] = useState([])
  const [connecting, setConnecting] = useState({})
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [form] = Form.useForm()

  const viewingUserId = paramUserId ? parseInt(paramUserId, 10) : null
  const isOwnProfile = !viewingUserId || viewingUserId === authUser?.id

  const loadData = async () => {
    setLoading(true)
    try {
      const prof = viewingUserId ? await getProfileByUserId(viewingUserId) : await getProfile()
      const targetId = prof?.id
      const [conns, feedOrPosts, recv, sent, discover] = await Promise.all([
        targetId ? getConnections(targetId).catch(() => []) : Promise.resolve([]),
        isOwnProfile ? getFeed().catch(() => []) : (targetId ? getPostsByUser(targetId).catch(() => []) : Promise.resolve([])),
        isOwnProfile ? getReceivedRequests().catch(() => []) : Promise.resolve([]),
        isOwnProfile ? getSentRequests().catch(() => []) : Promise.resolve([]),
        discoverUsers().catch(() => [])
      ])
      const names = {}
      if (prof?.id && prof?.name) names[prof.id] = prof.name
      ;(discover || []).forEach(u => { if (u?.id && u?.name) names[u.id] = u.name })
      setUserNames(names)
      setDiscoverUsersList(Array.isArray(discover) ? discover : [])
      setProfile(prof)
      setConnections(Array.isArray(conns) ? conns : [])
      setReceivedRequests(Array.isArray(recv) ? recv : [])
      setSentRequests(Array.isArray(sent) ? sent : [])
      const myPosts = isOwnProfile && Array.isArray(feedOrPosts) ? feedOrPosts.filter(p => p.userId === targetId) : (Array.isArray(feedOrPosts) ? feedOrPosts : [])
      setPosts(myPosts)
    } catch (err) {
      message.error(err.body || err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [authUser?.id, viewingUserId])

  const handleAccept = async (requestId) => {
    try {
      await acceptConnectionRequest(requestId)
      message.success('Connection accepted')
      loadData()
    } catch (err) {
      message.error(err.body || err.message || 'Failed to accept')
    }
  }

  const handleReject = async (requestId) => {
    try {
      await rejectConnectionRequest(requestId)
      message.success('Request rejected')
      loadData()
    } catch (err) {
      message.error(err.body || err.message || 'Failed to reject')
    }
  }

  const openEditModal = () => {
    form.setFieldsValue({
      name: profile?.name || '',
      headline: profile?.headline || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
    })
    setEditModalOpen(true)
  }

  const handleSaveProfile = async () => {
    try {
      const values = await form.validateFields()
      setSavingProfile(true)
      const updated = await updateProfile({
        name: values.name?.trim() || undefined,
        headline: values.headline?.trim() || undefined,
        bio: values.bio?.trim() || undefined,
        location: values.location?.trim() || undefined,
      })
      setProfile(updated)
      setEditModalOpen(false)
      message.success('Profile updated')
      loadUser?.()
    } catch (err) {
      if (err.errorFields) return
      message.error(err.body || err.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleConnect = async (userId) => {
    setConnecting(prev => ({ ...prev, [userId]: true }))
    try {
      await sendConnectionRequest(userId)
      message.success('Connection request sent')
      loadData()
    } catch (err) {
      message.error(err.body || err.message || 'Failed to send request')
    } finally {
      setConnecting(prev => ({ ...prev, [userId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="profile-page" style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    )
  }

  const displayUser = profile || authUser
  const initials = displayUser?.name ? displayUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'
  const pendingReceived = receivedRequests.filter(r => r.status === 'PENDING')
  const pendingSent = sentRequests.filter(r => r.status === 'PENDING')
  const connectionIds = new Set((connections || []).map(c => c.userId))
  const suggestedUsers = discoverUsersList.filter(
    u => u?.id && u.id !== profile?.id && !connectionIds.has(u.id) && !pendingSent.some(r => r.receiverId === u.id)
  ).slice(0, 5)

  return (
    <div className="profile-page">
      <div className="profile-cover">
        <div className="profile-cover-logo">
          <Logo size={80} invert />
        </div>
      </div>

      <div className="profile-header-card">
        <div className="profile-header-inner">
          <div className="profile-avatar-wrap">
            <Avatar
              size={140}
              style={{
                backgroundColor: 'var(--primary)',
                border: '4px solid var(--bg-card)',
                fontSize: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {initials}
            </Avatar>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{displayUser?.name || ''}</h1>
            {(displayUser?.headline || displayUser?.email) && (
              <p className="profile-headline">{displayUser.headline || displayUser.email}</p>
            )}
            {displayUser?.location && (
              <p className="profile-location" style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0', color: 'var(--text-secondary)', fontSize: 14 }}>
                <EnvironmentOutlined /> {displayUser.location}
              </p>
            )}
            <div className="profile-meta">
              <span><LinkOutlined /> {connections.length} connection{connections.length !== 1 ? 's' : ''}</span>
            </div>
            {isOwnProfile ? (
              <Button type="primary" icon={<EditOutlined />} onClick={openEditModal} style={{ marginTop: 12 }}>
                Edit profile
              </Button>
            ) : (
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {connectionIds.has(authUser?.id) ? (
                  <Button type="primary">Message</Button>
                ) : (
                  <Button type="primary" icon={<UserAddOutlined />} onClick={() => handleConnect(profile?.id)} loading={connecting[profile?.id]}>
                    Connect
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div>
          {displayUser?.bio && (
            <div className="profile-card">
              <h3 className="profile-card-title">About</h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                {displayUser.bio}
              </p>
            </div>
          )}

          <div className="profile-card">
            <h3 className="profile-card-title">Activity</h3>
            {posts.length === 0 ? (
              <Text type="secondary">No posts</Text>
            ) : (
              <div>
                {posts.slice(0, 5).map(p => (
                  <div key={p.id} className="profile-activity-item">
                    <Text style={{ fontSize: 15 }}>{p.content}</Text>
                    <div className="profile-activity-date">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside>
          {isOwnProfile && (
          <div className="profile-card">
            <h3 className="profile-card-title">Grow your network</h3>
            {suggestedUsers.length === 0 ? (
              <Text type="secondary">No suggestions</Text>
            ) : (
              <div>
                {suggestedUsers.map(u => (
                  <div key={u.id} className="profile-connection-item" style={{ marginBottom: 12 }}>
                    <Link to={`/profile/${u.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0, textDecoration: 'none', color: 'inherit' }}>
                      <Avatar size={40} style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600 }}>
                        {u.name ? u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                      </Avatar>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text style={{ fontWeight: 500, display: 'block' }}>{u.name || ''}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{u.email || ''}</Text>
                      </div>
                    </Link>
                    <Button
                      type="primary"
                      size="small"
                      icon={<UserAddOutlined />}
                      loading={connecting[u.id]}
                      onClick={() => handleConnect(u.id)}
                    >
                      Connect
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          {isOwnProfile && (
          <div className="profile-card">
            <h3 className="profile-card-title">Connection Requests</h3>
            {pendingReceived.length === 0 && pendingSent.length === 0 ? (
              <Text type="secondary">No pending requests</Text>
            ) : (
              <div>
                {pendingReceived.map(r => (
                  <div key={r.id} className="profile-request-item">
                    <Text><Link to={r.senderId ? `/profile/${r.senderId}` : '#'} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500 }}>{userNames[r.senderId] || `User ${r.senderId}`}</Link> wants to connect</Text>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button type="primary" size="small" onClick={() => handleAccept(r.id)}>
                        Accept
                      </Button>
                      <Button size="small" danger onClick={() => handleReject(r.id)}>
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
                {pendingSent.map(r => (
                  <div key={r.id} className="profile-request-item">
                    <Text type="secondary">Pending: <Link to={r.receiverId ? `/profile/${r.receiverId}` : '#'} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500 }}>{userNames[r.receiverId] || `User ${r.receiverId}`}</Link></Text>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          <div className="profile-card">
            <h3 className="profile-card-title">Connections</h3>
            {connections.length === 0 ? (
              <Text type="secondary">No connections</Text>
            ) : (
              <div>
                {connections.slice(0, 5).map((c, i) => {
                  const displayName = userNames[c.userId] || c.name || (c.userId != null ? `User ${c.userId}` : 'User')
                  const initials = displayName ? displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'
                  return (
                  <Link key={c.userId ?? i} to={`/profile/${c.userId}`} className="profile-connection-item" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <Avatar size={40} style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600 }}>
                      {initials}
                    </Avatar>
                    <Text style={{ fontWeight: 500 }}>{displayName}</Text>
                  </Link>
                  )
                })}
              </div>
            )}
          </div>
        </aside>
      </div>

      <Modal
        title="Edit profile"
        open={editModalOpen}
        onOk={handleSaveProfile}
        onCancel={() => setEditModalOpen(false)}
        confirmLoading={savingProfile}
        okText="Save"
        width={480}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input placeholder="Your name" />
          </Form.Item>
          <Form.Item name="headline" label="Headline">
            <Input placeholder="e.g. Software Engineer at Company" maxLength={500} showCount />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input placeholder="e.g. San Francisco, CA" maxLength={200} showCount />
          </Form.Item>
          <Form.Item name="bio" label="About">
            <Input.TextArea placeholder="Tell others about yourself" rows={4} maxLength={2000} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Profile
