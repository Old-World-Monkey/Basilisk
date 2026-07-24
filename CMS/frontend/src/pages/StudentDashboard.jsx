import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import axios from 'axios'
import { CalendarIcon, UsersIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function StudentDashboard() {
  const { user, logout, accessToken } = useAuthStore()
  const [attendance, setAttendance] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  }

  useEffect(() => {
    fetchProfile()
    fetchAttendance()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/profile/`, { headers })
      setProfile(res.data)
    } catch (err) {
      console.error('Failed to fetch profile', err)
    }
  }

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/users/my-attendance/`, { headers })
      setAttendance(res.data)
    } catch (err) {
      console.error('Failed to fetch attendance', err)
    } finally {
      setLoading(false)
    }
  }

  const navItems = [
    { path: '/student', label: 'Dashboard', icon: ChartBarIcon },
    { path: '/timetable', label: 'Timetable', icon: CalendarIcon },
  ]

  const attendanceSummary = attendance.reduce((acc, record) => {
    acc[record.status] = (acc[record.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">BASILISK</h1>
              <div className="ml-8 flex space-x-4">
                {navItems.map((item) => (
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
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user?.first_name || user?.username} (Student)
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Dashboard</h2>
          <p className="text-gray-600">Welcome back, {user?.first_name || user?.username}!</p>
        </div>

        {profile && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="font-medium text-gray-900">{profile.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">First Name</p>
                <p className="font-medium text-gray-900">{profile.first_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Name</p>
                <p className="font-medium text-gray-900">{profile.last_name || '-'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ChartBarIcon className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">{attendance.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UsersIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Present</p>
                <p className="text-2xl font-bold text-gray-900">{attendanceSummary.present || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <CalendarIcon className="w-8 h-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-gray-900">{attendanceSummary.absent || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Attendance</h3>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : attendance.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No attendance records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendance.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{record.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.subject.name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === 'present' ? 'bg-green-100 text-green-800' :
                          record.status === 'absent' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
