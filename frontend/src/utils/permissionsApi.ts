import axios from 'axios'
import { Permission, PermissionCreate, PermissionUpdate } from '@/types/permission.interface'
import { useAuthStore } from '../stores/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: API_URL,
})

// Add a request interceptor to add the auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().auth.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const permissionsApi = {
  getAllPermissions: async (): Promise<Permission[]> => {
    const response = await api.get('/permissions/')
    return response.data
  },

  getPermission: async (id: string): Promise<Permission> => {
    const response = await api.get(`/permissions/${id}`)
    return response.data
  },

  createPermission: async (permission: PermissionCreate): Promise<Permission> => {
    const response = await api.post('/permissions/', permission)
    return response.data
  },

  updatePermission: async (id: string, permission: PermissionUpdate): Promise<Permission> => {
    const response = await api.patch(`/permissions/${id}`, permission)
    return response.data
  },

  deletePermission: async (id: string): Promise<void> => {
    await api.delete(`/permissions/${id}`)
  }
}
