import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { TrashIcon } from '@heroicons/react/24/outline'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function StudentsPage() {
  const { accessToken } = useAuthStore()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  }

  const fetchStudents = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${API_URL}/users/teacher-students/`, { headers })
      setStudents(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const deleteStudent = async (id) => {
    setLoading(true)
    setError('')
    try {
      await axios.delete(`${API_URL}/users/students/${id}/`, { headers })
      setStudents(students.filter((s) => s.id !== id))
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage and view student records</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No students found.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Roll Number</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Class</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{student.roll_number}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {student.user?.first_name} {student.user?.last_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {student.class_obj?.name} - {student.class_obj?.section}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{student.user?.email}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteStudent(student.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
