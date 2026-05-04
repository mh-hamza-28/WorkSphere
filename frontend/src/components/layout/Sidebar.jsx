import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, CheckSquare, UserCircle, X } from 'lucide-react'
import './Sidebar.css'

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/projects', icon: FolderKanban, label: 'Projects' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/profile', icon: UserCircle, label: 'Profile' },
  ]

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <span className="logo-icon">W</span>
            </div>
            <span className="sidebar-title">WorkSphere</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => onClose()}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-copyright"> 2024 WorkSphere</p>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
    </>
  )
}

export default Sidebar
