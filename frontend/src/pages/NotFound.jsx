import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">
          <AlertTriangle size={64} />
        </div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-text">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <Home size={18} /> Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
