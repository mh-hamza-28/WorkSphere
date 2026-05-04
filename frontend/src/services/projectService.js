import api from './api.js'

const projectService = {
  getAllProjects: async () => {
    const response = await api.get('/projects')
    return response.data.data || response.data
  },

  getProjectById: async (projectId) => {
    const response = await api.get(`/projects/${projectId}`)
    return response.data.data || response.data
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData)
    return response.data.data || response.data
  },

  updateProject: async (projectId, projectData) => {
    const response = await api.put(`/projects/${projectId}`, projectData)
    return response.data.data || response.data
  },

  deleteProject: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`)
    return response.data.data || response.data
  },

  getProjectMembers: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/members`)
    return response.data.data || response.data
  },

  addMember: async (projectId, memberData) => {
    const response = await api.post(`/projects/${projectId}/members`, memberData)
    return response.data.data || response.data
  },

  updateMemberRole: async (projectId, userId, newRole) => {
    const response = await api.put(`/projects/${projectId}/members/${userId}`, { newRole })
    return response.data.data || response.data
  },

  removeMember: async (projectId, userId) => {
    const response = await api.delete(`/projects/${projectId}/members/${userId}`)
    return response.data.data || response.data
  },
}

export default projectService
