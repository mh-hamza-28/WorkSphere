import api from './api.js'

const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications')
    return response.data.data || response.data
  },

  markRead: async (notificationId) => {
    const response = await api.patch(`/notifications/${notificationId}/read`)
    return response.data.data || response.data
  },

  markAllRead: async () => {
    const response = await api.patch('/notifications/read-all')
    return response.data.data || response.data
  },

  respondToInvite: async (notificationId, action) => {
    const response = await api.post(`/notifications/${notificationId}/respond`, { action })
    return response.data.data || response.data
  },
}

export default notificationService
