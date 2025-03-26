import axios from 'axios'
import { Role, RoleCreate, RoleUpdate } from '@/types/role.interface'
import { Permission } from '@/types/permission.interface'
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

export const rolesApi = {
  // Ruoli
  getAllRoles: async (): Promise<Role[]> => {
    // Usa l'istanza api che ha già configurato l'interceptor per l'autenticazione
    const response = await api.get('/roles/')
    return response.data
  },

  getRole: async (id: string): Promise<Role> => {
    const response = await api.get(`/roles/${id}`)
    return response.data
  },

  createRole: async (role: RoleCreate): Promise<Role> => {
    const response = await api.post('/roles/', role)
    return response.data
  },

  updateRole: async (id: string, role: RoleUpdate): Promise<Role> => {
    const response = await api.patch(`/roles/${id}`, role)
    return response.data
  },

  deleteRole: async (id: string): Promise<void> => {
    await api.delete(`/roles/${id}`)
  },

  // Permessi associati ai ruoli
  getRolePermissions: async (roleId: string): Promise<Permission[]> => {
    const response = await api.get(`/roles/${roleId}/permissions`)
    return response.data
  },

  assignPermissionToRole: async (roleId: string, permissionId: string): Promise<void> => {
    await api.post(`/roles/${roleId}/permissions/${permissionId}`, {})
  },

  removePermissionFromRole: async (roleId: string, permissionId: string): Promise<void> => {
    await api.delete(`/roles/${roleId}/permissions/${permissionId}`)
  },

  // Ruoli utente
  getUserRoles: async (userId: string): Promise<any[]> => {
    const response = await api.get(`/user-roles/user/${userId}`)
    return response.data
  },

  getUsersWithRole: async (roleId: string, restaurantId?: string): Promise<any[]> => {
    let url = `/user-roles/role/${roleId}`
    if (restaurantId) {
      url += `?restaurant_id=${restaurantId}`
    }
    const response = await api.get(url)
    return response.data
  },

  assignRoleToUser: async (userId: string, roleId: string, restaurantId?: string): Promise<any> => {
    const data = {
      user_id: userId,
      role_id: roleId,
      restaurant_id: restaurantId
    }
    const response = await api.post('/user-roles/', data)
    return response.data
  },

  removeRoleFromUser: async (userRoleId: string): Promise<void> => {
    await api.delete(`/user-roles/${userRoleId}`)
  }
}
