import { useState } from 'react'
import { User, Mail, Shield, Key, Edit2, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import authService from '../services/authService.js'
import Loader from '../components/common/Loader.jsx'
import './Profile.css'

const Profile = () => {
  const { user, refreshUser } = useAuth()
  const [activeTab, setActiveTab] = useState('info')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setLoading(true)
    try {
      await authService.changePassword(passwordForm.oldPassword, passwordForm.newPassword)
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to change password' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setLoading(true)
    try {
      await authService.resendVerificationEmail()
      setMessage({ type: 'success', text: 'Verification email sent!' })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to send verification email' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your account settings</p>
        </div>
      </div>

      <div className="profile-layout">
        <div className="profile-sidebar card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt={user.username} />
              ) : (
                <span>{user?.username?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <h3 className="profile-name">{user?.fullName}</h3>
            <p className="profile-username">@{user?.username}</p>
            <span className={`verification-badge ${user?.isEmailVerified ? 'verified' : 'unverified'}`}>
              {user?.isEmailVerified ? (
                <><CheckCircle size={14} /> Verified</>
              ) : (
                <><AlertCircle size={14} /> Unverified</>
              )}
            </span>
          </div>

          <nav className="profile-nav">
            <button 
              className={`profile-nav-item ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <User size={18} /> Personal Info
            </button>
            <button 
              className={`profile-nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Shield size={18} /> Security
            </button>
          </nav>
        </div>

        <div className="profile-content">
          {activeTab === 'info' && (
            <div className="profile-section card">
              <div className="section-header">
                <h2 className="section-title">Personal Information</h2>
                <button className="btn btn-secondary btn-sm">
                  <Edit2 size={14} /> Edit
                </button>
              </div>

              <div className="profile-info-grid">
                <div className="info-item">
                  <label className="info-label">
                    <User size={14} /> Full Name
                  </label>
                  <p className="info-value">{user?.fullName}</p>
                </div>

                <div className="info-item">
                  <label className="info-label">
                    <Mail size={14} /> Email Address
                  </label>
                  <p className="info-value">{user?.email}</p>
                </div>

                <div className="info-item">
                  <label className="info-label">
                    <User size={14} /> Username
                  </label>
                  <p className="info-value">{user?.username}</p>
                </div>
              </div>

              {!user?.isEmailVerified && (
                <div className="verification-alert">
                  <AlertCircle size={20} />
                  <div>
                    <p>Your email is not verified</p>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={handleResendVerification}
                      disabled={loading}
                    >
                      {loading ? <Loader size="sm" /> : 'Resend Verification Email'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="profile-section card">
              <div className="section-header">
                <h2 className="section-title">Change Password</h2>
              </div>

              {message.text && (
                <div className={`alert alert-${message.type}`}>
                  {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="password-form">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? <Loader size="sm" /> : 'Change Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
