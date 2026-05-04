import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './context/AuthContext.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import Loader from './components/common/Loader.jsx'

import Landing from './pages/Landing.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'

import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/projects/Projects.jsx'
import ProjectDetails from './pages/projects/ProjectDetails.jsx'
import Tasks from './pages/tasks/Tasks.jsx'
import Profile from './pages/Profile.jsx'
import NotFound from './pages/NotFound.jsx'

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <Loader fullScreen />
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <Loader fullScreen />
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />
}

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
