import { Outlet, useNavigate, Navigate, Link, NavLink, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Dropdown, Button, Input, Avatar, Spin, Badge } from 'antd'
import {
  BellOutlined,
  MessageOutlined,
  SearchOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useUnread } from '../context/UnreadContext'
import { useNotifications } from '../context/NotificationContext'
import Logo from './Logo'
import MobileNav from './MobileNav'
import './Layout.css'

const { Header, Content } = AntLayout

function Layout() {
  const { theme, toggleTheme } = useTheme()
  const { user, loading, logout } = useAuth()
  const { totalUnread } = useUnread()
  const { unreadCount: notificationUnread } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()
  const isProfile = location.pathname.startsWith('/profile')
  const isNetwork = location.pathname === '/network'
  const isChat = location.pathname === '/chat'
  const isNotifications = location.pathname === '/notifications'

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'

  const userMenu = {
    items: [
      {
        key: 'profile',
        label: 'My Profile',
        icon: <UserOutlined />,
        onClick: () => navigate('/profile')
      },
      {
        key: 'theme',
        label: `Toggle Theme (${theme})`,
        onClick: toggleTheme
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: 'Sign Out',
        icon: <LogoutOutlined />,
        danger: true,
        onClick: handleLogout
      },
    ],
  };

  return (
    <AntLayout className="layout">
      <Header className="layout-header">
        <div className="layout-header-inner">
          <Link to="/feed" className="header-logo">
            <Logo size={28} showText />
          </Link>

          <div className="header-search">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined style={{ color: 'var(--text-muted)', fontSize: 16 }} />}
              variant="borderless"
              style={{ background: 'transparent', fontSize: 14 }}
            />
          </div>

          <div className="header-actions">
            <Badge count={notificationUnread} size="small" offset={[-2, 2]}>
              <Button type="text" icon={<BellOutlined />} size="large" onClick={() => navigate('/notifications')} />
            </Badge>
            <Badge count={totalUnread} size="small" offset={[-2, 2]}>
              <Button type="text" icon={<MessageOutlined />} size="large" onClick={() => navigate('/chat')} />
            </Badge>
            <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
              <Avatar style={{ backgroundColor: 'var(--primary)', cursor: 'pointer' }} size={32}>
                {initials}
              </Avatar>
            </Dropdown>
          </div>
        </div>
      </Header>

      <div className="layout-inner">
        <aside className="layout-sidebar">
          <nav className="layout-sidebar-nav">
            <NavLink to="/feed" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon">🏠</span>
              <span>Home</span>
            </NavLink>
            <NavLink to="/network" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon">🌐</span>
              <span>My Network</span>
            </NavLink>
            <NavLink to="/chat">
              <Badge count={totalUnread} size="small" offset={[-2, 2]}>
                <span className="nav-icon">💬</span>
              </Badge>
              <span>Messaging</span>
            </NavLink>
            <NavLink to="/notifications" className={({ isActive }) => isActive ? 'active' : ''}>
              <Badge count={notificationUnread} size="small" offset={[-2, 2]}>
                <span className="nav-icon">🔔</span>
              </Badge>
              <span>Notifications</span>
            </NavLink>
            <NavLink to="/profile">
              <span className="nav-icon">👤</span>
              <span>Profile</span>
            </NavLink>
          </nav>
        </aside>

        <Content className={`layout-main ${isProfile || isNetwork || isChat || isNotifications ? 'layout-main-wide' : ''}`}>
          <Outlet />
        </Content>
      </div>
      <MobileNav />
    </AntLayout>
  )
}

export default Layout
