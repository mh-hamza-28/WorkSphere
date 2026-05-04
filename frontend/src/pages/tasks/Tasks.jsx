import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, CheckSquare, FolderKanban } from 'lucide-react'
import { useProjects } from '../../hooks/useProjects.js'
import { useTasks } from '../../hooks/useTasks.js'
import TaskCard from '../../components/tasks/TaskCard.jsx'
import Modal from '../../components/common/Modal.jsx'
import Loader from '../../components/common/Loader.jsx'
import './Tasks.css'

const Tasks = () => {
  const { projects, refetch: refetchProjects } = useProjects()
  const [selectedProject, setSelectedProject] = useState('')
  const { tasks, loading, createTask, updateTask, deleteTask, assignTask, changeTaskStatus } = useTasks(selectedProject)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditTaskModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  
  const [taskForm, setTaskForm] = useState({ 
    title: '', 
    description: '', 
    assignedTo: '', 
    status: 'TODO' 
  })

  const currentProject = projects.find(p => (p.project?._id || p._id) === selectedProject)
  const currentMembers = currentProject?.members || []

  useEffect(() => {
    refetchProjects()
  }, [])

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].project?._id || projects[0]._id)
    }
  }, [projects, selectedProject])

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!selectedProject) return
    
    setSubmitting(true)
    try {
      await createTask(taskForm)
      setIsCreateModalOpen(false)
      setTaskForm({ title: '', description: '', assignedTo: '', status: 'TODO' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditTask = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await updateTask(selectedTask._id, taskForm)
      setIsEditTaskModalOpen(false)
      setSelectedTask(null)
      setTaskForm({ title: '', description: '', assignedTo: '', status: 'TODO' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId)
    }
  }

  const openEditTaskModal = (task) => {
    setSelectedTask(task)
    setTaskForm({
      title: task.title,
      description: task.description || '',
      assignedTo: task.assignedTo?._id || '',
      status: task.status
    })
    setIsEditTaskModalOpen(true)
  }

  const todoCount = tasks.filter(t => t.status === 'TODO').length
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length
  const doneCount = tasks.filter(t => t.status === 'DONE').length

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Manage and track all your tasks</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsCreateModalOpen(true)}
          disabled={!selectedProject}
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      <div className="tasks-toolbar">
        <div className="project-selector">
          <label className="form-label">Select Project</label>
          <select
            className="form-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            {projects.map((project) => {
              const projectData = project.project || project
              return (
                <option key={projectData._id} value={projectData._id}>
                  {projectData.name}
                </option>
              )
            })}
          </select>
        </div>

        <div className="filters">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-wrapper">
            <Filter size={18} className="filter-icon" />
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        </div>
      </div>

      {selectedProject && (
        <div className="tasks-stats">
          <div className="stat-item">
            <span className="stat-dot todo" />
            <span className="stat-label">To Do:</span>
            <span className="stat-value">{todoCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-dot inprogress" />
            <span className="stat-label">In Progress:</span>
            <span className="stat-value">{inProgressCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-dot done" />
            <span className="stat-label">Done:</span>
            <span className="stat-value">{doneCount}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <Loader />
        </div>
      ) : !selectedProject ? (
        <div className="empty-state card">
          <FolderKanban size={64} className="empty-state-icon" />
          <h3 className="empty-state-title">No project selected</h3>
          <p className="empty-state-text">Please select a project to view tasks</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state card">
          <CheckSquare size={64} className="empty-state-icon" />
          <h3 className="empty-state-title">
            {searchTerm || statusFilter !== 'all' ? 'No tasks found' : 'No tasks yet'}
          </h3>
          <p className="empty-state-text">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first task to get started'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={18} /> Create Task
            </button>
          )}
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              projectMembers={currentMembers}
              onEdit={openEditTaskModal}
              onDelete={handleDeleteTask}
              onStatusChange={changeTaskStatus}
              onAssign={assignTask}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Task"
      >
        <form onSubmit={handleCreateTask} className="task-form">
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Assign To</label>
            <select
              className="form-select"
              value={taskForm.assignedTo}
              onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
            >
              <option value="">Unassigned</option>
              {currentMembers.map((member) => (
                <option key={member.user?._id} value={member.user?._id}>
                  {member.user?.fullName || member.user?.username} ({member.user?.email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={taskForm.status}
              onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <Loader size="sm" /> : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditTaskModalOpen(false)}
        title="Edit Task"
      >
        <form onSubmit={handleEditTask} className="task-form">
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Assign To</label>
            <select
              className="form-select"
              value={taskForm.assignedTo}
              onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
            >
              <option value="">Unassigned</option>
              {currentMembers.map((member) => (
                <option key={member.user?._id} value={member.user?._id}>
                  {member.user?.fullName || member.user?.username}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={taskForm.status}
              onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditTaskModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <Loader size="sm" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Tasks
