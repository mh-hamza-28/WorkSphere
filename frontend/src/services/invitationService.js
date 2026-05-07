import api from './api.js'

const invitationService = {
  getInvitationByToken: async (token) => {
    const response = await api.get(`/invitations/${token}`)
    return response.data.data || response.data
  },

  getMyInvitations: async () => {
    const response = await api.get('/invitations')
    return response.data.data || response.data
  },

  acceptInvitation: async (token) => {
    const response = await api.post(`/invitations/${token}/accept`)
    return response.data.data || response.data
  },

  rejectInvitation: async (token) => {
    const response = await api.post(`/invitations/${token}/reject`)
    return response.data.data || response.data
  },
}

export default invitationService
