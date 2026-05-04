import { Link } from 'react-router-dom'
import { Users, Calendar, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'
import './ProjectCard.css'

const ProjectCard = ({ project, onEdit, onDelete, isAdmin }) => {
  const [showMenu, setShowMenu] = useState(false)

  const projectData = project.project || project
  const projectId = projectData._id || project.project?._id

  return (
    <div className="project-card card">
      <div className="project-card-header">
        <div className="project-icon">
          <span>{projectData.name?.charAt(0).toUpperCase()}</span>
        </div>
        {isAdmin && (
          <div className="project-menu">
            <button 
              className="menu-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical size={16} />
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <button onClick={() => { onEdit(projectData); setShowMenu(false) }}>
                  <Edit size={14} /> Edit
                </button>
                <button className="danger" onClick={() => { onDelete(projectId); setShowMenu(false) }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Link to={`/projects/${projectId}`} className="project-card-body">
        <h3 className="project-title">{projectData.name}</h3>
        <p className="project-description">{projectData.description || 'No description'}</p>
      </Link>

      <div className="project-card-footer">
        <div className="project-meta">
          <span className="badge badge-member">
            <Users size={12} />
            {projectData.members || 1} members
          </span>
        </div>
        <div className="project-date">
          <Calendar size={12} />
          {projectData.createdAt && format(new Date(projectData.createdAt), 'MMM d, yyyy')}
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
