import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import notificationService from '../services/notificationService.js'
import toast from 'react-hot-toast'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
const socketOrigin = apiUrl.replace(/\/api\/v1\/?$/, '')

const loadSocketScript = () => {
  if (window.io) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-socket-io]')
    if (existing) {
      existing.addEventListener('load', resolve, { once: true })
      existing.addEventListener('error', reject, { once: true })
      return
    }
    const script = document.createElement('script')
    script.src = `${socketOrigin}/socket.io/socket.io.js`
    script.async = true
    script.dataset.socketIo = 'true'
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

export const useNotifications = (isAuthenticated) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const socketRef = useRef(null)

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  )

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    try {
      const response = await notificationService.getNotifications()
      setNotifications(response || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  useEffect(() => {
    if (!isAuthenticated) return undefined

    let cancelled = false
    const token = localStorage.getItem('accessToken')
    if (!token) return undefined

    loadSocketScript()
      .then(() => {
        if (cancelled || !window.io) return
        const socket = window.io(socketOrigin, { auth: { token } })
        socketRef.current = socket
        socket.on('notification:new', (notification) => {
          setNotifications((current) => [notification, ...current])
          if (notification.type?.startsWith('project_invite') || notification.type === 'role_assigned') {
            window.dispatchEvent(new CustomEvent('projects:changed', { detail: notification }))
          }
          if (notification.type?.startsWith('task_')) {
            window.dispatchEvent(new CustomEvent('tasks:changed', { detail: notification }))
          }
          toast(notification.title || 'New notification')
        })
      })
      .catch(() => {
        toast.error('Live notifications could not connect')
      })

    return () => {
      cancelled = true
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [isAuthenticated])

  const markRead = async (notificationId) => {
    const updated = await notificationService.markRead(notificationId)
    setNotifications((current) =>
      current.map((notification) =>
        notification._id === notificationId ? { ...notification, ...updated } : notification
      )
    )
  }

  const markAllRead = async () => {
    if (unreadCount === 0) return
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true }))
    )
    try {
      await notificationService.markAllRead()
    } catch (error) {
      fetchNotifications()
      toast.error(error.response?.data?.message || 'Failed to mark notifications as read')
    }
  }

  const respondToInvite = async (notificationId, action) => {
    const updated = await notificationService.respondToInvite(notificationId, action)
    setNotifications((current) =>
      current.map((notification) =>
        notification._id === notificationId ? { ...notification, ...updated } : notification
      )
    )
    window.dispatchEvent(new CustomEvent('projects:changed', { detail: updated }))
    toast.success(action === 'accept' ? 'Project invitation accepted' : 'Project invitation rejected')
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markRead,
    markAllRead,
    respondToInvite,
  }
}
