import { useAuthStore } from '../store/authStore'

export default function SettingsPage() {
  const { user } = useAuthStore()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure system settings and notification rules</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-3">Notification Rules</h3>
        <p className="text-gray-500 text-sm mb-4">Configure attendance threshold and alert channels</p>
        
        <div className="text-gray-500">
          Settings page - coming soon in Sprint 3
        </div>
      </div>
    </div>
  )
}