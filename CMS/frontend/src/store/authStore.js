import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      initialized: false,

      login: async (username, password) => {
        try {
          const response = await axios.post(`${API_URL}/auth/login/`, { username, password })
          const { access, refresh } = response.data
          localStorage.setItem('accessToken', access)
          localStorage.setItem('refreshToken', refresh)
          
          const userResponse = await axios.get(`${API_URL}/users/me/`, {
            headers: { Authorization: `Bearer ${access}` }
          })
          
          set({ user: userResponse.data, accessToken: access, refreshToken: refresh, initialized: true })
          return { success: true }
        } catch (error) {
          return { success: false, error: error.response?.data?.detail || 'Login failed' }
        }
      },

      logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({ user: null, accessToken: null, refreshToken: null, initialized: true })
      },

      initialize: () => {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        axios.get(`${API_URL}/users/me/`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }).then(response => {
          set({ user: response.data, accessToken, initialized: true })
        }).catch(() => {
          set({ user: null, accessToken: null, initialized: true })
        })
      } else {
        set({ user: null, accessToken: null, initialized: true })
      }
    }
    }),
    {
      name: 'auth-storage'
    }
  )
)