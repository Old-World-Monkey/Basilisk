import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ChartBarIcon, CalendarIcon, UsersIcon, CogIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { user, logout } = useAuthStore()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: ChartBarIcon },
    { path: '/timetable', label: 'Timetable', icon: CalendarIcon },
    { path: '/students', label: 'Students', icon: UsersIcon, roles: ['TEACHER', 'HOD'] },
    { path: '/reports', label: 'Reports', icon: ClipboardDocumentListIcon, roles: ['HOD', 'ADMIN'] },
    { path: '/settings', label: 'Settings', icon: CogIcon, roles: ['ADMIN'] },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">BASILISK</h1>
              <div className="ml-8 flex space-x-4">
                {navItems.map((item) => {
                  if (item.roles) {
                    const roleName = user?.role === 1 ? 'TEACHER' : user?.role === 2 ? 'HOD' : 'ADMIN'
                    if (!item.roles.includes(roleName)) return null
                  }
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end
                      className={({ isActive }) =>
                        `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 inline mr-1 -mt-0.5" />
                      {item.label}
                    </NavLink>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user?.first_name || user?.username} (
                {user?.role === 1 ? 'Teacher' : user?.role === 2 ? 'HOD' : 'Admin'})
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to BASILISK</h2>
          <p className="text-gray-600">College Attendance & Timetable Management Platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CalendarIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Classes</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <UsersIcon className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">120</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ChartBarIcon className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                <p className="text-2xl font-bold text-gray-900">85%</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}