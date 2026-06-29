import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const DAYS = [
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
  { label: 'Sunday', value: 7 },
]

export default function TimetableView() {
  const { accessToken } = useAuthStore()

  const { data: timetable, isLoading, error } = useQuery({
    queryKey: ['timetable'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/timetable/my-schedule/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      return response.data
    },
    enabled: !!accessToken
  })

  if (!accessToken) {
    return <div className="text-center py-8">Please log in to view timetable</div>
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        Error loading timetable: {error.message}
      </div>
    )
  }

  const organized = timetable?.reduce((acc, entry) => {
    const day = entry.day_of_week
    if (!acc[day]) acc[day] = []
    acc[day].push(entry)
    return acc
  }, {}) || {}

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Timetable</h1>
        <p className="text-gray-600 mt-1">Weekly schedule of classes</p>
      </div>

      {timetable.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No timetable entries found. Contact your administrator to set up classes.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Day</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Room</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {DAYS.map(({ label, value }) => {
                const entries = organized[value] || []
                return (
                  <tr key={label} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{label}</td>
                    <td className="px-4 py-3">
                      {entries.length > 0 ? (
                        entries.map(e => (
                          <div key={e.id} className="mb-1 last:mb-0 text-sm">
                            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2">
                              {e.start_time?.slice(0, 5)} - {e.end_time?.slice(0, 5)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {entries.length > 0 ? (
                        entries.map(e => (
                          <div key={e.id} className="mb-1 last:mb-0 text-sm">
                            {e.subject_name || e.subject?.code || 'Untitled'}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {entries.length > 0 ? (
                        entries.map(e => (
                          <div key={e.id} className="mb-1 last:mb-0 text-sm">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {e.room}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}