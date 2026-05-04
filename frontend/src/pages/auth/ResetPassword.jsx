import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react'
import authService from '../../services/authService.js'
import Loader from '../../components/common/Loader.jsx'
import './Auth.css'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword(token, formData.newPassword)
      setSuccess(true)
    } catch (error) {
      console.error('Reset password error:', error)
      // Backend sends errors in { success, statusCode, message, errors } format
      const backendErrors = error.response?.data?.errors
      const backendMessage = error.response?.data?.message
      
      if (backendErrors && Array.isArray(backendErrors) && backendErrors.length > 0) {
        const fieldErrors = {}
        backendErrors.forEach(errObj => {
          const [field, message] = Object.entries(errObj)[0]
          fieldErrors[field] = message
        })
        setErrors(fieldErrors)
      } else if (backendMessage) {
        setErrors({ general: backendMessage })
      } else {
        setErrors({ general: error.message || 'Failed to reset password. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="success-state">
              <div className="success-icon">
                <CheckCircle size={48} />
              </div>
              <h2>Password Reset Successful!</h2>
              <p>Your password has been reset successfully. You can now sign in with your new password.</p>
              <button 
                className="btn btn-primary btn-full"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <span className="logo-icon">W</span>
            </div>
            <h1 className="auth-title">Reset password</h1>
            <p className="auth-subtitle">Create a new password for your account</p>
          </div>

          {errors.general && (
            <div className="auth-error">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className={`input-wrapper ${errors.newPassword ? 'error' : ''}`}>
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  className="form-input"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && <span className="form-error">{errors.newPassword}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? (
                <Loader size="sm" />
              ) : (
                <>
                  Reset Password <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
