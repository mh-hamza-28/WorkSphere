import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, FolderKanban } from 'lucide-react'
import { useProjects } from '../../hooks/useProjects.js'
import ProjectCard from '../../components/projects/ProjectCard.jsx'
import Modal from '../../components/common/Modal.jsx'
import Loader from '../../components/common/Loader.jsx'
import './Projects.css'

const Projects = () => {
  const { projects, loading, createProject, updateProject, deleteProject, refetch } = useProjects()
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  const filteredProjects = projects.filter(project => {
    const projectData = project.project || project
    return projectData.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           projectData.description?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createProject(formData)
      setIsCreateModalOpen(false)
      setFormData({ name: '', description: '' })
    } catch (error) {
      console.error('Failed to create project:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await updateProject(selectedProject._id, formData)
      setIsEditModalOpen(false)
      setSelectedProject(null)
      setFormData({ name: '', description: '' })
    } catch (error) {
      console.error('Failed to update project:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await deleteProject(selectedProject._id)
      setIsDeleteModalOpen(false)
      setSelectedProject(null)
    } catch (error) {
      console.error('Failed to delete project:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = (project) => {
    const projectData = project.project || project
    setSelectedProject(projectData)
    setFormData({
      name: projectData.name,
      description: projectData.description || ''
    })
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (projectId) => {
    const project = projects.find(p => {
      const pid = p.project?._id || p._id
      return pid === projectId
    })
    const projectData = project?.project || project
    setSelectedProject(projectData)
    setIsDeleteModalOpen(true)
  }

  return (
    <div className="projects-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage and organize your projects</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="projects-toolbar">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="empty-state card">
          <FolderKanban size={64} className="empty-state-icon" />
          <h3 className="empty-state-title">
            {searchTerm ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="empty-state-text">
            {searchTerm 
              ? 'Try adjusting your search' 
              : 'Create your first project to get started with WorkSphere'}
          </p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={18} /> Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.project?._id || project._id}
              project={project}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              isAdmin={project.role === 'admin'}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateSubmit} className="project-form">
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter project description"
              rows={4}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <Loader size="sm" /> : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
      >
        <form onSubmit={handleEditSubmit} className="project-form">
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter project description"
              rows={4}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <Loader size="sm" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Project"
        size="sm"
      >
        <div className="delete-confirm">
          <p>Are you sure you want to delete <strong>{selectedProject?.name}</strong>?</p>
          <p className="text-gray-500 text-sm mt-2">This action cannot be undone.</p>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={submitting}>
              {submitting ? <Loader size="sm" /> : 'Delete Project'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Projects
