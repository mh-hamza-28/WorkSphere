import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService.js'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('accessToken')
      if (storedUser && token) {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      const { user: userData, accessToken } = response
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('accessToken', accessToken)
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      return await authService.register(userData)
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
    }
  }

  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser()
      // authService already extracts the data, so response is the data directly
      const userData = response?.data || response
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    } catch (error) {
      console.error('Failed to refresh user:', error)
      throw error
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
