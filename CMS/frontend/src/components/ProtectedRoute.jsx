import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ children }) {
  const { user, initialized } = useAuthStore()
  const location = useLocation()

  if (!initialized) return null

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export function RoleRoute({ children, allowedRoles }) {
  const { user, initialized } = useAuthStore()
  const location = useLocation()

  if (!initialized) return null

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const userRole = user?.role === 'teacher' ? 'TEACHER' : user?.role === 'student' ? 'STUDENT' : user?.role === 'admin' ? 'ADMIN' : user?.role === 'hod' ? 'HOD' : 'ADMIN'
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === 'ADMIN') return <Navigate to="/" replace />
    if (userRole === 'TEACHER' || userRole === 'HOD') return <Navigate to="/teacher" replace />
    if (userRole === 'STUDENT') return <Navigate to="/student" replace />
    return <Navigate to="/" replace />
  }

  return children
}