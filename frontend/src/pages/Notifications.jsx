import { useState, useEffect, useRef } from 'react'
import { List, Spin, message, Empty, Button, Alert } from 'antd'
import { BellOutlined, ReloadOutlined } from '@ant-design/icons'
import { getNotifications, markNotificationAsRead } from '../api/notifications'
import { useNotifications } from '../context/NotificationContext'
import './Notifications.css'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const { refreshUnread } = useNotifications()
  const errorShownRef = useRef(false)

  const loadNotifications = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    errorShownRef.current = false
    try {
      setFetchError(null)
      const data = await getNotifications()
      setNotifications(Array.isArray(data) ? data : [])
    } catch (err) {
      setFetchError(err.message || 'Failed to load notifications')
      if (!errorShownRef.current) {
        errorShownRef.current = true
        message.error(err.message || 'Failed to load notifications')
      }
      setNotifications([])
      console.error('Notifications fetch error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadNotifications(false)
  }, [])

  useEffect(() => {
    refreshUnread()
  }, [notifications, refreshUnread])

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      )
      refreshUnread()
    } catch (err) {
      message.error('Failed to mark as read')
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const now = new Date()
    const diff = now - d
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return d.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-loading">
          <Spin size="large" />
        </div>
      </div>
    )
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>
          <BellOutlined /> Notifications
        </h1>
        <Button
          type="text"
          icon={<ReloadOutlined />}
          onClick={() => loadNotifications(true)}
          loading={refreshing}
        >
          Refresh
        </Button>
      </div>
      {fetchError && (
        <Alert
          type="error"
          message="Connection error"
          description={fetchError}
          showIcon
          closable
          onClose={() => setFetchError(null)}
          style={{ marginBottom: 16 }}
        />
      )}
      <div className="notifications-list">
        {fetchError ? (
          <Empty description="Could not load. Click Refresh to try again." />
        ) : notifications.length === 0 ? (
          <Empty description="No notifications yet" />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                className={item.read ? 'notification-read' : 'notification-unread'}
                onClick={() => !item.read && handleMarkRead(item.id)}
                style={{ cursor: item.read ? 'default' : 'pointer' }}
              >
                <List.Item.Meta
                  title={item.message}
                  description={formatDate(item.createAt)}
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  )
}

export default Notifications
