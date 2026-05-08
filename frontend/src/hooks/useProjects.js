import { useState, useEffect, useCallback } from 'react'
import projectService from '../services/projectService.js'
import toast from 'react-hot-toast'

export const useProjects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await projectService.getAllProjects()
      setProjects(response || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects')
      toast.error(err.response?.data?.message || 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    const handleProjectsChanged = () => fetchProjects()
    window.addEventListener('projects:changed', handleProjectsChanged)
    return () => window.removeEventListener('projects:changed', handleProjectsChanged)
  }, [fetchProjects])

  const createProject = async (projectData) => {
    try {
      const response = await projectService.createProject(projectData)
      toast.success('Project created successfully')
      await fetchProjects()
      return response
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project')
      throw err
    }
  }

  const updateProject = async (projectId, projectData) => {
    try {
      const response = await projectService.updateProject(projectId, projectData)
      toast.success('Project updated successfully')
      await fetchProjects()
      return response.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project')
      throw err
    }
  }

  const deleteProject = async (projectId) => {
    try {
      await projectService.deleteProject(projectId)
      toast.success('Project deleted successfully')
      await fetchProjects()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project')
      throw err
    }
  }

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  }
}

export const useProject = (projectId) => {
  const [project, setProject] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id)
  }

  const fetchProject = useCallback(async () => {
    if (!projectId || !isValidObjectId(projectId)) {
      setError('Invalid project ID')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const [projectRes, membersRes] = await Promise.all([
        projectService.getProjectById(projectId),
        projectService.getProjectMembers(projectId),
      ])
      setProject(projectRes)
      setMembers(membersRes || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch project')
      toast.error(err.response?.data?.message || 'Failed to fetch project')
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  useEffect(() => {
    const handleProjectsChanged = () => fetchProject()
    window.addEventListener('projects:changed', handleProjectsChanged)
    return () => window.removeEventListener('projects:changed', handleProjectsChanged)
  }, [fetchProject])

  const addMember = async (email, role) => {
    try {
      await projectService.addMember(projectId, { email, role })
      toast.success('Project request sent to user')
      await fetchProject()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member')
      throw err
    }
  }

  const removeMember = async (userId) => {
    try {
      await projectService.removeMember(projectId, userId)
      toast.success('Member removed successfully')
      await fetchProject()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member')
      throw err
    }
  }

  const updateMemberRole = async (userId, newRole) => {
    try {
      await projectService.updateMemberRole(projectId, userId, newRole)
      toast.success('Member role updated successfully')
      await fetchProject()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update member role')
      throw err
    }
  }

  return {
    project,
    members,
    loading,
    error,
    refetch: fetchProject,
    addMember,
    removeMember,
    updateMemberRole,
  }
}
