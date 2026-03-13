import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Splash from './pages/Splash'
import Onboarding from './pages/Onboarding'
import Auth from './pages/Auth'
import HomeFeed from './pages/HomeFeed'
import Network from './pages/Network'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Layout from './components/Layout'
import { useAuth } from './context/AuthContext'

function App() {
  const { isAuthenticated } = useAuth()
  const [hasSeenSplash, setHasSeenSplash] = useState(() => 
    sessionStorage.getItem('prolink-splash') === 'done'
  )

  const handleSplashComplete = () => {
    sessionStorage.setItem('prolink-splash', 'done')
    setHasSeenSplash(true)
  }

  // Flow: Splash → Onboarding → Auth (Login/Signup) → Home
  const getRedirectAfterSplash = () => {
    if (isAuthenticated) return '/feed'
    if (localStorage.getItem('prolink-onboarding')) return '/auth'
    return '/onboarding'
  }

  return (
    <Routes>
      <Route path="/" element={
        !hasSeenSplash ? (
          <Splash onComplete={handleSplashComplete} />
        ) : (
          <Navigate to={getRedirectAfterSplash()} replace />
        )
      } />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/feed" replace />} />
        <Route path="feed" element={<HomeFeed />} />
        <Route path="network" element={<Network />} />
        <Route path="chat" element={<Chat />} />
        <Route path="profile/:userId?" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
