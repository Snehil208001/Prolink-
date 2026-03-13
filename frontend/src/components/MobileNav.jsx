import { NavLink } from 'react-router-dom'
import './MobileNav.css'

function MobileNav() {
  return (
    <nav className="mobile-nav">
      <NavLink to="/feed" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Home</span>
      </NavLink>
      <NavLink to="/network" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">🌐</span>
        <span className="nav-label">Network</span>
      </NavLink>
      <NavLink to="/chat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">💬</span>
        <span className="nav-label">Chat</span>
      </NavLink>
      <NavLink to="/feed" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">🔔</span>
        <span className="nav-label">Notifications</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon">👤</span>
        <span className="nav-label">Profile</span>
      </NavLink>
    </nav>
  )
}

export default MobileNav
