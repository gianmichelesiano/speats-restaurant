import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { z } from 'zod';

// Schema for tenant data
export const tenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
});

export type Tenant = z.infer<typeof tenantSchema>;

const baseURL = import.meta.env.VITE_CHAT_API;

// Create an axios instance with the base URL
const api = axios.create({
  baseURL,
});

// Add a request interceptor to add the auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tenants API functions
export const tenantsApi = {
  // Get all tenants
  getAllTenants: async (): Promise<Tenant[]> => {
    const response = await api.get('/api/v1/tenants/');
    return response.data;
  },
  
  // Get a single tenant
  getTenant: async (tenantId: string): Promise<Tenant> => {
    const response = await api.get(`/api/v1/tenants/${tenantId}`);
    return response.data;
  },
  
  // Create a new tenant
  createTenant: async (tenant: Omit<Tenant, 'id'>): Promise<Tenant> => {
    const response = await api.post('/api/v1/tenants/', tenant);
    return response.data;
  },
  
  // Update a tenant
  updateTenant: async (tenantId: string, tenant: Omit<Tenant, 'id'>): Promise<Tenant> => {
    const response = await api.put(`/api/v1/tenants/${tenantId}`, tenant);
    return response.data;
  },
  
  // Delete a tenant
  deleteTenant: async (tenantId: string): Promise<Tenant> => {
    const response = await api.delete(`/api/v1/tenants/${tenantId}`);
    return response.data;
  }
};
