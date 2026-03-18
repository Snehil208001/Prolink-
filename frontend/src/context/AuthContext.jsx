import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getProfile } from '../api/users'
import { setOnUnauthorized } from '../api/client'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('prolink-token')

  const logout = useCallback(() => {
    localStorage.removeItem('prolink-token')
    localStorage.removeItem('prolink-user')
    setUser(null)
  }, [])

  useEffect(() => {
    setOnUnauthorized(logout)
    return () => setOnUnauthorized(null)
  }, [logout])

  const loadUser = useCallback(async () => {
    const t = localStorage.getItem('prolink-token')
    if (!t) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const profile = await getProfile()
      setUser(profile)
      localStorage.setItem('prolink-user', JSON.stringify(profile))
    } catch {
      setUser(null)
      localStorage.removeItem('prolink-token')
      localStorage.removeItem('prolink-user')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) loadUser()
    else setLoading(false)
  }, [token, loadUser])

  const login = (jwt, userData = null) => {
    localStorage.setItem('prolink-token', jwt)
    if (userData) {
      setUser(userData)
      localStorage.setItem('prolink-user', JSON.stringify(userData))
    }
    loadUser()
  }


  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, loading, token, login, logout, loadUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
