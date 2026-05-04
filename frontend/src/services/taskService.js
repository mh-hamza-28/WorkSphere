import api from './api.js'

const taskService = {
  getTasksByProject: async (projectId) => {
    const response = await api.get(`/tasks/project/${projectId}`)
    return response.data.data || response.data
  },

  createTask: async (projectId, taskData) => {
    const response = await api.post(`/tasks/project/${projectId}`, taskData)
    return response.data.data || response.data
  },

  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData)
    return response.data.data || response.data
  },

  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`)
    return response.data.data || response.data
  },

  assignTask: async (taskId, assignedTo) => {
    const response = await api.put(`/tasks/${taskId}/assign`, { assignedTo })
    return response.data.data || response.data
  },

  changeTaskStatus: async (taskId, status) => {
    const response = await api.put(`/tasks/${taskId}/status`, { status })
    return response.data.data || response.data
  },

  createSubtask: async (taskId, title) => {
    const response = await api.post(`/tasks/${taskId}/subtasks`, { title })
    return response.data.data || response.data
  },

  updateSubtask: async (subtaskId, title) => {
    const response = await api.put(`/tasks/subtasks/${subtaskId}`, { title })
    return response.data.data || response.data
  },

  deleteSubtask: async (subtaskId) => {
    const response = await api.delete(`/tasks/subtasks/${subtaskId}`)
    return response.data.data || response.data
  },

  markSubtaskComplete: async (subtaskId, isCompleted) => {
    const response = await api.put(`/tasks/subtasks/${subtaskId}/status`, { isCompleted })
    return response.data.data || response.data
  },
}

export default taskService
