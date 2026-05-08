import { Bell, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { useNotifications } from '../../hooks/useNotifications.js'
import './Navbar.css'

const Navbar = ({ onMenuToggle }) => {
  const { user, logout, isAuthenticated } = useAuth()
  const [panelOpen, setPanelOpen] = useState(false)
  const { notifications, unreadCount, loading, markRead, markAllRead, respondToInvite } = useNotifications(isAuthenticated)
  const navigate = useNavigate()

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return
    await logout()
  }

  const getInitial = () => {
    const source = user?.fullname || user?.fullName || user?.username || user?.email || 'U'
    return source.charAt(0).toUpperCase()
  }

  const displayName = user?.fullname || user?.fullName || user?.username

  const handleNotificationClick = async (notification) => {
    if (!notification.read) await markRead(notification._id)
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
        <div className="notification-wrap">
          <button
            className={`navbar-btn ${unreadCount > 0 ? 'has-notification' : ''}`}
            onClick={() => {
              setPanelOpen((open) => !open)
              markAllRead()
            }}
            title="Notifications"
          >
            <Bell size={20} />
          </button>

          {panelOpen && (
            <div className="notification-panel">
              <div className="notification-header">
                <span>Notifications</span>
                {unreadCount > 0 && <span className="notification-count">{unreadCount} new</span>}
              </div>
              <div className="notification-list">
                {loading && <div className="notification-empty">Loading...</div>}
                {!loading && notifications.length === 0 && (
                  <div className="notification-empty">No notifications yet</div>
                )}
                {!loading && notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`notification-item ${notification.read ? '' : 'unread'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-topline">
                      <span className="notification-title">{notification.title}</span>
                      {!notification.read && <span className="new-dot" />}
                    </div>
                    <p>{notification.message}</p>
                    <div className="notification-meta">
                      {notification.project?.name && <span>{notification.project.name}</span>}
                      <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                    </div>
                    {notification.targetUser && (
                      <div className="notification-meta">
                        <span>{notification.targetUser.username}</span>
                        <span>{notification.targetUser._id}</span>
                      </div>
                    )}
                    {notification.type === 'project_invite' && notification.invitationStatus === 'pending' && (
                      <div className="notification-actions">
                        <button onClick={(e) => { e.stopPropagation(); respondToInvite(notification._id, 'accept') }}>
                          Accept
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); respondToInvite(notification._id, 'reject') }}>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="navbar-user">
          <div className="user-avatar">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt={user.username} />
            ) : (
              <span>{getInitial()}</span>
            )}
          </div>
          <div className="user-info">
            <span className="user-name">{displayName}</span>
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
