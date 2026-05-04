import { useState } from 'react'
import { 
  Calendar, 
  User, 
  CheckCircle2, 
  Circle, 
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  CheckSquare
} from 'lucide-react'
import { format } from 'date-fns'
import { useSubtasks } from '../../hooks/useTasks.js'
import './TaskCard.css'

const TaskCard = ({ 
  task, 
  projectMembers,
  onEdit, 
  onDelete, 
  onStatusChange, 
  onAssign,
  onSubtaskCreate,
  onSubtaskUpdate,
  onSubtaskDelete,
  onSubtaskToggle
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [showSubtasks, setShowSubtasks] = useState(false)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [isAddingSubtask, setIsAddingSubtask] = useState(false)

  const getStatusBadge = (status) => {
    switch (status) {
      case 'TODO':
        return <span className="badge badge-todo">To Do</span>
      case 'IN_PROGRESS':
        return <span className="badge badge-inprogress">In Progress</span>
      case 'DONE':
        return <span className="badge badge-done">Done</span>
      default:
        return <span className="badge badge-todo">To Do</span>
    }
  }

  const completedSubtasks = task.subtasks?.filter(s => s.isCompleted).length || 0
  const totalSubtasks = task.subtasks?.length || 0

  const handleAddSubtask = async (e) => {
    e.preventDefault()
    if (!newSubtaskTitle.trim()) return
    
    await onSubtaskCreate(task._id, newSubtaskTitle.trim())
    setNewSubtaskTitle('')
    setIsAddingSubtask(false)
  }

  return (
    <div className="task-card card">
      <div className="task-card-header">
        <div className="task-status-wrapper">
          <button 
            className="status-btn"
            onClick={() => {
              const statuses = ['TODO', 'IN_PROGRESS', 'DONE']
              const currentIndex = statuses.indexOf(task.status)
              const nextStatus = statuses[(currentIndex + 1) % statuses.length]
              onStatusChange(task._id, nextStatus)
            }}
          >
            {task.status === 'DONE' ? (
              <CheckCircle2 size={18} className="status-done" />
            ) : (
              <Circle size={18} className={`status-${task.status.toLowerCase()}`} />
            )}
          </button>
          {getStatusBadge(task.status)}
        </div>

        <div className="task-menu">
          <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>
            <MoreVertical size={16} />
          </button>
          {showMenu && (
            <div className="menu-dropdown">
              <button onClick={() => { onEdit(task); setShowMenu(false) }}>
                <Edit size={14} /> Edit
              </button>
              <button className="danger" onClick={() => { onDelete(task._id); setShowMenu(false) }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="task-card-body">
        <h4 className="task-title">{task.title}</h4>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>

      <div className="task-card-meta">
        <div className="task-assignee">
          <User size={14} />
          {task.assignedTo ? (
            <span>{task.assignedTo.fullName || task.assignedTo.email}</span>
          ) : (
            <select 
              className="assign-select"
              onChange={(e) => onAssign(task._id, e.target.value)}
              defaultValue=""
            >
              <option value="">Assign to...</option>
              {projectMembers?.map((member) => (
                <option key={member.user._id} value={member.user._id}>
                  {member.user.fullName || member.user.email}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="task-date">
          <Calendar size={14} />
          <span>{format(new Date(task.createdAt), 'MMM d')}</span>
        </div>
      </div>

      {totalSubtasks > 0 && (
        <div className="task-subtasks-summary">
          <button 
            className="subtasks-toggle"
            onClick={() => setShowSubtasks(!showSubtasks)}
          >
            <CheckSquare size={14} />
            <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
            {showSubtasks ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      )}

      {showSubtasks && (
        <div className="subtasks-list">
          {task.subtasks?.map((subtask) => (
            <div key={subtask._id} className={`subtask-item ${subtask.isCompleted ? 'completed' : ''}`}>
              <button 
                className="subtask-checkbox"
                onClick={() => onSubtaskToggle(subtask._id, !subtask.isCompleted)}
              >
                {subtask.isCompleted ? <CheckCircle2 size={14} /> : <Circle size={14} />}
              </button>
              <span className="subtask-title">{subtask.title}</span>
              <button 
                className="subtask-delete"
                onClick={() => onSubtaskDelete(subtask._id)}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}

          {isAddingSubtask ? (
            <form onSubmit={handleAddSubtask} className="subtask-form">
              <input
                type="text"
                className="subtask-input"
                placeholder="Enter subtask title..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                autoFocus
                onBlur={() => !newSubtaskTitle && setIsAddingSubtask(false)}
              />
            </form>
          ) : (
            <button 
              className="add-subtask-btn"
              onClick={() => setIsAddingSubtask(true)}
            >
              <Plus size={14} /> Add subtask
            </button>
          )}
        </div>
      )}

      {!showSubtasks && totalSubtasks === 0 && (
        <button 
          className="add-subtask-btn minimal"
          onClick={() => setShowSubtasks(true)}
        >
          <Plus size={14} /> Add subtask
        </button>
      )}
    </div>
  )
}

export default TaskCard
