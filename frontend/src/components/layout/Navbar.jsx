import { Bell, User, LogOut, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import './Navbar.css'

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <Menu size={24} />
        </button>
        <div className="navbar-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <div className="navbar-logo">
            <span className="logo-icon">W</span>
          </div>
          <span className="navbar-title">WorkSphere</span>
        </div>
      </div>

      <div className="navbar-right">
        <button className="navbar-btn">
          <Bell size={20} />
        </button>

        <div className="navbar-user">
          <div className="user-avatar">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt={user.username} />
            ) : (
              <User size={20} />
            )}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.fullName || user?.username}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>

        <button className="navbar-btn logout-btn" onClick={handleLogout} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
