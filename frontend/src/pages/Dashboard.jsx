import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Plus, 
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react'
import { useProjects } from '../hooks/useProjects.js'
import ProjectCard from '../components/projects/ProjectCard.jsx'
import Loader from '../components/common/Loader.jsx'
import './Dashboard.css'

const Dashboard = () => {
  const { projects, loading } = useProjects()
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
  })

  useEffect(() => {
    if (projects) {
      let totalTasks = 0
      let completedTasks = 0
      let inProgressTasks = 0

      projects.forEach(project => {
        const projectData = project.project || project
        if (projectData.tasks) {
          totalTasks += projectData.tasks.length
          completedTasks += projectData.tasks.filter(t => t.status === 'DONE').length
          inProgressTasks += projectData.tasks.filter(t => t.status === 'IN_PROGRESS').length
        }
      })

      setStats({
        totalProjects: projects.length,
        totalTasks,
        completedTasks,
        inProgressTasks,
      })
    }
  }, [projects])

  const recentProjects = projects.slice(0, 3)

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <Link to="/projects" className="btn btn-primary">
          <Plus size={18} /> New Project
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon projects">
            <FolderKanban size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalProjects}</span>
            <span className="stat-label">Total Projects</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon tasks">
            <CheckSquare size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalTasks}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.completedTasks}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon inprogress">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.inProgressTasks}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recent Projects</h2>
            <Link to="/projects" className="section-link">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-state">
              <Loader />
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="empty-state card">
              <FolderKanban size={48} className="empty-state-icon" />
              <h3 className="empty-state-title">No projects yet</h3>
              <p className="empty-state-text">Create your first project to get started</p>
              <Link to="/projects" className="btn btn-primary">
                <Plus size={18} /> Create Project
              </Link>
            </div>
          ) : (
            <div className="projects-grid grid grid-cols-3">
              {recentProjects.map((project) => (
                <ProjectCard 
                  key={project.project?._id || project._id} 
                  project={project}
                  isAdmin={project.role === 'admin'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
