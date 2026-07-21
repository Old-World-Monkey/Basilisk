import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { PlusIcon, TrashIcon, CalendarIcon, UsersIcon, ChartBarIcon, ClipboardDocumentListIcon, CogIcon } from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { user, logout } = useAuthStore()

  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])

  const [teacherForm, setTeacherForm] = useState({ name: '', email: '', subject: '' })
  const [classForm, setClassForm] = useState({ name: '', section: '', room: '' })
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', teacher: '' })

  const addTeacher = () => {
    if (!teacherForm.name || !teacherForm.email) return
    setTeachers([...teachers, { ...teacherForm, id: Date.now() }])
    setTeacherForm({ name: '', email: '', subject: '' })
  }

  const addClass = () => {
    if (!classForm.name || !classForm.section) return
    setClasses([...classes, { ...classForm, id: Date.now() }])
    setClassForm({ name: '', section: '', room: '' })
  }

  const addSubject = () => {
    if (!subjectForm.name || !subjectForm.code) return
    setSubjects([...subjects, { ...subjectForm, id: Date.now() }])
    setSubjectForm({ name: '', code: '', teacher: '' })
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
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Teacher
              </button>
            </div>
            {teachers.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Teachers List</h3>
                <ul className="space-y-2">
                  {teachers.map((t) => (
                    <li key={t.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <div>
                        <p className="font-medium text-gray-900">{t.name}</p>
                        <p className="text-sm text-gray-600">{t.email} - {t.subject}</p>
                      </div>
                      <button
                        onClick={() => setTeachers(teachers.filter((x) => x.id !== t.id))}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Class
              </button>
            </div>
            {classes.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Classes List</h3>
                <ul className="space-y-2">
                  {classes.map((c) => (
                    <li key={c.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <div>
                        <p className="font-medium text-gray-900">{c.name} - {c.section}</p>
                        <p className="text-sm text-gray-600">Room: {c.room}</p>
                      </div>
                      <button
                        onClick={() => setClasses(classes.filter((x) => x.id !== c.id))}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
              <input
                type="text"
                placeholder="Assigned Teacher"
                value={subjectForm.teacher}
                onChange={(e) => setSubjectForm({ ...subjectForm, teacher: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addSubject}
                className="bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 flex items-center justify-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Subject
              </button>
            </div>
            {subjects.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Subjects List</h3>
                <ul className="space-y-2">
                  {subjects.map((s) => (
                    <li key={s.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <div>
                        <p className="font-medium text-gray-900">{s.name} ({s.code})</p>
                        <p className="text-sm text-gray-600">Teacher: {s.teacher}</p>
                      </div>
                      <button
                        onClick={() => setSubjects(subjects.filter((x) => x.id !== s.id))}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
