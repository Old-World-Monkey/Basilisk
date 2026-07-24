import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import axios from 'axios'
import { PlusIcon, TrashIcon, CalendarIcon, UsersIcon, ChartBarIcon, ClipboardDocumentListIcon, CogIcon } from '@heroicons/react/24/outline'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function Dashboard() {
  const { user, logout, accessToken } = useAuthStore()

  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])

  const [teacherForm, setTeacherForm] = useState({ name: '', email: '', subject: '' })
  const [classForm, setClassForm] = useState({ name: '', section: '', room: '' })
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', teacher_id: '' })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  }

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/teachers/`, { headers })
      setTeachers(res.data)
    } catch (err) {
      console.error('Failed to fetch teachers', err)
    }
  }

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/classes/`, { headers })
      setClasses(res.data)
    } catch (err) {
      console.error('Failed to fetch classes', err)
    }
  }

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/subjects/`, { headers })
      setSubjects(res.data)
    } catch (err) {
      console.error('Failed to fetch subjects', err)
    }
  }

  useEffect(() => {
    fetchTeachers()
    fetchClasses()
    fetchSubjects()
  }, [])

  const addTeacher = async () => {
    if (!teacherForm.name || !teacherForm.email) return
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${API_URL}/users/teachers/`, teacherForm, { headers })
      setTeachers([...teachers, res.data])
      setTeacherForm({ name: '', email: '', subject: '' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add teacher')
    } finally {
      setLoading(false)
    }
  }

  const addClass = async () => {
    if (!classForm.name || !classForm.section) return
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${API_URL}/users/classes/`, classForm, { headers })
      setClasses([...classes, res.data])
      setClassForm({ name: '', section: '', room: '' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add class')
    } finally {
      setLoading(false)
    }
  }

  const addSubject = async () => {
    if (!subjectForm.name || !subjectForm.code || !subjectForm.teacher_id) return
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${API_URL}/users/subjects/`, subjectForm, { headers })
      setSubjects([...subjects, res.data])
      setSubjectForm({ name: '', code: '', teacher_id: '' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add subject')
    } finally {
      setLoading(false)
    }
  }

  const deleteTeacher = async (id) => {
    setLoading(true)
    setError('')
    try {
      await axios.delete(`${API_URL}/users/teachers/${id}/`, { headers })
      setTeachers(teachers.filter((t) => t.id !== id))
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete teacher')
    } finally {
      setLoading(false)
    }
  }

  const deleteClass = async (id) => {
    setLoading(true)
    setError('')
    try {
      await axios.delete(`${API_URL}/users/classes/${id}/`, { headers })
      setClasses(classes.filter((c) => c.id !== id))
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete class')
    } finally {
      setLoading(false)
    }
  }

  const deleteSubject = async (id) => {
    setLoading(true)
    setError('')
    try {
      await axios.delete(`${API_URL}/users/subjects/${id}/`, { headers })
      setSubjects(subjects.filter((s) => s.id !== id))
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete subject')
    } finally {
      setLoading(false)
    }
  }

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Manage teachers, classes, and subjects</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Teacher</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={teacherForm.name}
                onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={teacherForm.email}
                onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Subject"
                value={teacherForm.subject}
                onChange={(e) => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addTeacher}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center disabled:opacity-50"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Teacher
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Teachers List</h3>
              {teachers.length === 0 ? (
                <p className="text-sm text-gray-500">No teachers added yet.</p>
              ) : (
                <ul className="space-y-2">
                  {teachers.map((t) => (
                    <li key={t.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <div>
                        <p className="font-medium text-gray-900">{t.name}</p>
                        <p className="text-sm text-gray-600">{t.email} - {t.subject}</p>
                      </div>
                      <button
                        onClick={() => deleteTeacher(t.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Class</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Class Name"
                value={classForm.name}
                onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Section"
                value={classForm.section}
                onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Room"
                value={classForm.room}
                onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addClass}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 flex items-center justify-center disabled:opacity-50"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Class
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Classes List</h3>
              {classes.length === 0 ? (
                <p className="text-sm text-gray-500">No classes added yet.</p>
              ) : (
                <ul className="space-y-2">
                  {classes.map((c) => (
                    <li key={c.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <div>
                        <p className="font-medium text-gray-900">{c.name} - {c.section}</p>
                        <p className="text-sm text-gray-600">Room: {c.room}</p>
                      </div>
                      <button
                        onClick={() => deleteClass(c.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Subject</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Subject Name"
                value={subjectForm.name}
                onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Subject Code"
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={subjectForm.teacher_id}
                onChange={(e) => setSubjectForm({ ...subjectForm, teacher_id: e.target.value ? Number(e.target.value) : '' })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <button
                onClick={addSubject}
                disabled={loading}
                className="bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 flex items-center justify-center disabled:opacity-50"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Subject
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Subjects List</h3>
              {subjects.length === 0 ? (
                <p className="text-sm text-gray-500">No subjects added yet.</p>
              ) : (
                <ul className="space-y-2">
                  {subjects.map((s) => (
                    <li key={s.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <div>
                        <p className="font-medium text-gray-900">{s.name} ({s.code})</p>
                        <p className="text-sm text-gray-600">
                          Teacher: {s.teacher?.name || 'N/A'}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteSubject(s.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
