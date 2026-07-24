import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store/authStore'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TimetableView from './pages/TimetableView'
import StudentsPage from './pages/StudentsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import ProtectedRoute, { RoleRoute } from './components/ProtectedRoute'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
})

function App() {
  const { user, initialized } = useAuthStore()

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
        <Route path="/" element={<RoleRoute allowedRoles={['ADMIN']}><Dashboard /></RoleRoute>} />
        <Route path="/timetable" element={<ProtectedRoute><TimetableView /></ProtectedRoute>} />
        <Route path="/students" element={<RoleRoute allowedRoles={['TEACHER', 'HOD', 'ADMIN']}><StudentsPage /></RoleRoute>} />
        <Route path="/student" element={<RoleRoute allowedRoles={['STUDENT']}><StudentDashboard /></RoleRoute>} />
        <Route path="/teacher" element={<RoleRoute allowedRoles={['TEACHER', 'HOD']}><TeacherDashboard /></RoleRoute>} />
        <Route path="/reports" element={<RoleRoute allowedRoles={['HOD', 'ADMIN']}><ReportsPage /></RoleRoute>} />
        <Route path="/settings" element={<RoleRoute allowedRoles={['ADMIN']}><SettingsPage /></RoleRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App