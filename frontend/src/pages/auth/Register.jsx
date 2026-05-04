import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import Loader from '../../components/common/Loader.jsx'
import './Auth.css'

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [registered, setRegistered] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full name is required'
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (formData.password !== formData.confirmPassword) {
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
      const { confirmPassword, ...registerData } = formData
      await register(registerData)
      setRegistered(true)
    } catch (error) {
      console.error('Registration error:', error)
      
      // Handle backend validation errors array
      const backendErrors = error.response?.data?.errors
      const backendMessage = error.response?.data?.message
      
      if (backendErrors && Array.isArray(backendErrors) && backendErrors.length > 0) {
        // Convert array of error objects to a single errors object
        const fieldErrors = {}
        backendErrors.forEach(errObj => {
          const [field, message] = Object.entries(errObj)[0]
          fieldErrors[field] = message
        })
        setErrors(fieldErrors)
      } else if (backendMessage) {
        // Backend sent a general message (e.g., "User with email or username already exists")
        setErrors({ general: backendMessage })
      } else {
        setErrors({ general: error.message || 'Registration failed. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  if (registered) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="success-state">
              <div className="success-icon">
                <CheckCircle size={48} />
              </div>
              <h2>Registration Successful!</h2>
              <p>A verification email has been sent to your email address. Please verify your email before signing in.</p>
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
            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">Join WorkSphere and manage your projects</p>
          </div>

          {errors.general && (
            <div className="auth-error">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className={`input-wrapper ${errors.fullname ? 'error' : ''}`}>
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    name="fullname"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.fullname}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                {errors.fullname && <span className="form-error">{errors.fullname}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <div className={`input-wrapper ${errors.username ? 'error' : ''}`}>
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    name="username"
                    className="form-input"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                {errors.username && <span className="form-error">{errors.username}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-input"
                    placeholder="Create password"
                    value={formData.password}
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
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
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
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
