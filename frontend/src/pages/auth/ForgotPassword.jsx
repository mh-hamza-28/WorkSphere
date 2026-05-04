import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react'
import authService from '../../services/authService.js'
import Loader from '../../components/common/Loader.jsx'
import './Auth.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      await authService.forgotPassword(email)
      setSuccess(true)
    } catch (err) {
      console.error('Forgot password error:', err)
      // Backend sends errors in { success, statusCode, message, errors } format
      const backendMessage = err.response?.data?.message
      setError(backendMessage || err.message || 'Failed to send reset instructions')
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
              <h2>Check your email</h2>
              <p>We've sent password reset instructions to <strong>{email}</strong></p>
              <Link to="/login" className="btn btn-primary btn-full">
                Back to Login
              </Link>
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
            <h1 className="auth-title">Forgot password?</h1>
            <p className="auth-subtitle">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          {error && (
            <div className="auth-error">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
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
                  Send Instructions <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <Link to="/login" className="back-link">
              <ArrowLeft size={16} /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
