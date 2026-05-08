import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Users, 
  Plus, 
  Trash2, 
  Edit2,
  X,
  CheckCircle,
  MoreVertical
} from 'lucide-react'
import { useProject } from '../../hooks/useProjects.js'
import { useTasks } from '../../hooks/useTasks.js'
import TaskCard from '../../components/tasks/TaskCard.jsx'
import Modal from '../../components/common/Modal.jsx'
import Loader from '../../components/common/Loader.jsx'
import toast from 'react-hot-toast'
import './ProjectDetails.css'

const toDateTimeInputValue = (value) => {
  if (!value) return ''
  const date = new Date(value)
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return offsetDate.toISOString().slice(0, 16)
}

const ProjectDetails = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  
  const { project, members, loading: projectLoading, addMember, removeMember, updateMemberRole } = useProject(projectId)
  const { 
    tasks, 
    loading: tasksLoading, 
    createTask, 
    updateTask, 
    deleteTask, 
    assignTask, 
    changeTaskStatus 
  } = useTasks(projectId)

  const [activeTab, setActiveTab] = useState('tasks')
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  
  const [memberForm, setMemberForm] = useState({ email: '', role: 'member' })
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '', status: 'TODO', deadline: '' })

  const loading = projectLoading || tasksLoading

  const handleAddMember = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addMember(memberForm.email, memberForm.role)
      setIsAddMemberModalOpen(false)
      setMemberForm({ email: '', role: 'member' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'User does not exist')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemoveMember = async (member) => {
    const name = member.user?.fullname || member.user?.fullName || member.user?.username || member.user?.email
    if (!window.confirm(`Remove ${name} from this project? Their previous assigned and done tasks will stay linked if they are added again.`)) return
    await removeMember(member.user._id)
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createTask(taskForm)
      setIsCreateTaskModalOpen(false)
      setTaskForm({ title: '', description: '', assignedTo: '', status: 'TODO', deadline: '' })
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
      setTaskForm({ title: '', description: '', assignedTo: '', status: 'TODO', deadline: '' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId)
    }
  }

  const handleAssignTask = async (taskId, userId) => {
    await assignTask(taskId, userId)
  }

  const handleChangeTaskStatus = async (taskId, status) => {
    await changeTaskStatus(taskId, status)
  }

  const openEditTaskModal = (task) => {
    setSelectedTask(task)
    setTaskForm({
      title: task.title,
      description: task.description || '',
      assignedTo: task.assignedTo?._id || '',
      status: task.status,
      deadline: toDateTimeInputValue(task.deadline)
    })
    setIsEditTaskModalOpen(true)
  }

  const handleSubtaskCreate = async (taskId, title) => {
    // This would need to be implemented with a custom hook
    // For now, refetch tasks
  }

  const handleSubtaskUpdate = async (subtaskId, title) => {
    // Implementation needed
  }

  const handleSubtaskDelete = async (subtaskId) => {
    // Implementation needed
  }

  const handleSubtaskToggle = async (subtaskId, isCompleted) => {
    // Implementation needed
  }

  if (loading) {
    return (
      <div className="loading-state">
        <Loader fullScreen />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="error-state">
        <h2>Project not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/projects')}>
          Back to Projects
        </button>
      </div>
    )
  }

  const todoTasks = tasks.filter(t => t.status === 'TODO')
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS')
  const doneTasks = tasks.filter(t => t.status === 'DONE')

  return (
    <div className="project-details-page">
      <button className="back-btn" onClick={() => navigate('/projects')}>
        <ArrowLeft size={18} /> Back to Projects
      </button>

      <div className="project-header">
        <div className="project-info">
          <div className="project-icon large">
            <span>{project.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h1 className="project-name">{project.name}</h1>
            <p className="project-description">{project.description || 'No description'}</p>
          </div>
        </div>
        <div className="project-actions">
          <button className="btn btn-secondary" onClick={() => setIsAddMemberModalOpen(true)}>
            <Users size={18} /> Members
          </button>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks ({tasks.length})
        </button>
        <button 
          className={`tab ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members ({members.length})
        </button>
      </div>

      {activeTab === 'tasks' && (
        <div className="tasks-section">
          <div className="tasks-header">
            <h2 className="section-title">Tasks</h2>
            <button className="btn btn-primary" onClick={() => setIsCreateTaskModalOpen(true)}>
              <Plus size={18} /> Add Task
            </button>
          </div>

          <div className="kanban-board">
            <div className="kanban-column">
              <div className="kanban-header todo">
                <span className="kanban-dot" />
                <span>To Do</span>
                <span className="kanban-count">{todoTasks.length}</span>
              </div>
              <div className="kanban-tasks">
                {todoTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    projectMembers={members}
                    onEdit={openEditTaskModal}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleChangeTaskStatus}
                    onAssign={handleAssignTask}
                    onSubtaskCreate={handleSubtaskCreate}
                    onSubtaskUpdate={handleSubtaskUpdate}
                    onSubtaskDelete={handleSubtaskDelete}
                    onSubtaskToggle={handleSubtaskToggle}
                  />
                ))}
              </div>
            </div>

            <div className="kanban-column">
              <div className="kanban-header inprogress">
                <span className="kanban-dot" />
                <span>In Progress</span>
                <span className="kanban-count">{inProgressTasks.length}</span>
              </div>
              <div className="kanban-tasks">
                {inProgressTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    projectMembers={members}
                    onEdit={openEditTaskModal}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleChangeTaskStatus}
                    onAssign={handleAssignTask}
                    onSubtaskCreate={handleSubtaskCreate}
                    onSubtaskUpdate={handleSubtaskUpdate}
                    onSubtaskDelete={handleSubtaskDelete}
                    onSubtaskToggle={handleSubtaskToggle}
                  />
                ))}
              </div>
            </div>

            <div className="kanban-column">
              <div className="kanban-header done">
                <span className="kanban-dot" />
                <span>Done</span>
                <span className="kanban-count">{doneTasks.length}</span>
              </div>
              <div className="kanban-tasks">
                {doneTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    projectMembers={members}
                    onEdit={openEditTaskModal}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleChangeTaskStatus}
                    onAssign={handleAssignTask}
                    onSubtaskCreate={handleSubtaskCreate}
                    onSubtaskUpdate={handleSubtaskUpdate}
                    onSubtaskDelete={handleSubtaskDelete}
                    onSubtaskToggle={handleSubtaskToggle}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="members-section">
          <div className="members-header">
            <h2 className="section-title">Project Members</h2>
            <button className="btn btn-primary" onClick={() => setIsAddMemberModalOpen(true)}>
              <Plus size={18} /> Add Member
            </button>
          </div>

          <div className="members-list">
            {members.map((member) => (
              <div key={member.user?._id} className="member-card">
                <div className="member-avatar">
                  {member.user?.avatar?.url ? (
                    <img src={member.user.avatar.url} alt={member.user.username} />
                  ) : (
                    <span>{(member.user?.fullname || member.user?.fullName || member.user?.username || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="member-info">
                  <span className="member-name">{member.user?.fullname || member.user?.fullName || member.user?.username}</span>
                  <span className="member-email">{member.user?.email}</span>
                </div>
                <span className={`badge badge-${member.role}`}>
                  {member.role}
                </span>
                <button 
                  className="member-remove"
                  onClick={() => handleRemoveMember(member)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        title="Add Member"
      >
        <form onSubmit={handleAddMember} className="member-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={memberForm.email}
              onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
              placeholder="Enter member's email"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={memberForm.role}
              onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddMemberModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <Loader size="sm" /> : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
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
              {members.map((member) => (
                <option key={member.user._id} value={member.user._id}>
                  {member.user.fullname || member.user.fullName || member.user.username} ({member.user.email})
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
          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input
              type="datetime-local"
              className="form-input"
              value={taskForm.deadline}
              onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsCreateTaskModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <Loader size="sm" /> : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditTaskModalOpen}
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
              {members.map((member) => (
                <option key={member.user._id} value={member.user._id}>
                  {member.user.fullname || member.user.fullName || member.user.username}
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
          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input
              type="datetime-local"
              className="form-input"
              value={taskForm.deadline}
              onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
            />
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

export default ProjectDetails
