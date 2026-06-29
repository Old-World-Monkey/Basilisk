import { useAuthStore } from '../store/authStore'

export default function ReportsPage() {
  const { user } = useAuthStore()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Generate attendance and performance reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-3">Attendance Reports</h3>
          <p className="text-gray-500 text-sm mb-4">Export attendance data by class, student, or date range</p>
          <button className="text-blue-600 text-sm font-medium hover:underline">Generate Report</button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-3">Summary Reports</h3>
          <p className="text-gray-500 text-sm mb-4">View department-wide attendance trends</p>
          <button className="text-blue-600 text-sm font-medium hover:underline">View Summary</button>
        </div>
      </div>
    </div>
  )
}