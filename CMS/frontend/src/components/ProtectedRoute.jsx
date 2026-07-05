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

  const userRole = user?.role === 1 ? 'TEACHER' : user?.role === 2 ? 'HOD' : 'ADMIN'
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />
  }

  return children
}