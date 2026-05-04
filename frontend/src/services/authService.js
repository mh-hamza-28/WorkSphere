import api from './api.js'

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data.data || response.data
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    const { accessToken, user } = response.data.data || response.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('user', JSON.stringify(user))
    return response.data.data || response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    return response.data.data || response.data
  },

  getCurrentUser: async () => {
    const response = await api.post('/auth/current-user')
    return response.data.data || response.data
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`)
    return response.data.data || response.data
  },

  resendVerificationEmail: async () => {
    const response = await api.post('/auth/resend-email-verification')
    return response.data.data || response.data
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data.data || response.data
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post(`/auth/reset-password/${token}`, { newPassword })
    return response.data.data || response.data
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/auth/change-password', { oldPassword, newPassword })
    return response.data.data || response.data
  },
}

export default authService
