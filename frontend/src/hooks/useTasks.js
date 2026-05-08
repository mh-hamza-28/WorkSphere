import { useState, useEffect, useCallback } from 'react'
import taskService from '../services/taskService.js'
import toast from 'react-hot-toast'

export const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id)
  }

  const fetchTasks = useCallback(async () => {
    if (!projectId || !isValidObjectId(projectId)) {
      setError('Invalid project ID')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await taskService.getTasksByProject(projectId)
      setTasks(response || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks')
      toast.error(err.response?.data?.message || 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  useEffect(() => {
    const handleTasksChanged = (event) => {
      const changedProjectId = event.detail?.project?._id || event.detail?.project
      if (!changedProjectId || changedProjectId === projectId) fetchTasks()
    }
    window.addEventListener('tasks:changed', handleTasksChanged)
    return () => window.removeEventListener('tasks:changed', handleTasksChanged)
  }, [fetchTasks, projectId])

  const createTask = async (taskData) => {
    try {
      const response = await taskService.createTask(projectId, taskData)
      toast.success('Task created successfully')
      await fetchTasks()
      return response.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task')
      throw err
    }
  }

  const updateTask = async (taskId, taskData) => {
    try {
      const response = await taskService.updateTask(taskId, taskData)
      toast.success('Task updated successfully')
      await fetchTasks()
      return response.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task')
      throw err
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId)
      toast.success('Task deleted successfully')
      await fetchTasks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task')
      throw err
    }
  }

  const assignTask = async (taskId, assignedTo) => {
    try {
      await taskService.assignTask(taskId, assignedTo)
      toast.success('Task assigned successfully')
      await fetchTasks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign task')
      throw err
    }
  }

  const changeTaskStatus = async (taskId, status) => {
    try {
      await taskService.changeTaskStatus(taskId, status)
      toast.success('Task status updated')
      await fetchTasks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task status')
      throw err
    }
  }

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    changeTaskStatus,
  }
}

export const useSubtasks = (taskId) => {
  const createSubtask = async (title) => {
    try {
      const response = await taskService.createSubtask(taskId, title)
      toast.success('Subtask created successfully')
      return response.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create subtask')
      throw err
    }
  }

  const updateSubtask = async (subtaskId, title) => {
    try {
      const response = await taskService.updateSubtask(subtaskId, title)
      toast.success('Subtask updated successfully')
      return response.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update subtask')
      throw err
    }
  }

  const deleteSubtask = async (subtaskId) => {
    try {
      await taskService.deleteSubtask(subtaskId)
      toast.success('Subtask deleted successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete subtask')
      throw err
    }
  }

  const markSubtaskComplete = async (subtaskId, isCompleted) => {
    try {
      const response = await taskService.markSubtaskComplete(subtaskId, isCompleted)
      return response.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update subtask')
      throw err
    }
  }

  return {
    createSubtask,
    updateSubtask,
    deleteSubtask,
    markSubtaskComplete,
  }
}
