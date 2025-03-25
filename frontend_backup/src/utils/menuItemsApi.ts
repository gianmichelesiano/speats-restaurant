import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { z } from 'zod';

// Schema for menu item data
export const menuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  image: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tenant_id: z.string(),
  restaurant_id: z.string(),
});

export type MenuItem = z.infer<typeof menuItemSchema>;

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

// Menu Items API functions
export const menuItemsApi = {
  // Get all menu items
  getAllMenuItems: async (tenantId?: string, restaurantId?: string, category?: string): Promise<MenuItem[]> => {
    const params: Record<string, string> = {};
    if (tenantId) params.tenant_id = tenantId;
    if (restaurantId) params.restaurant_id = restaurantId;
    if (category) params.category = category;
    
    const response = await api.get('/api/v1/menu-items/', { params });
    return response.data;
  },
  
  // Get a single menu item
  getMenuItem: async (menuItemId: string): Promise<MenuItem> => {
    const response = await api.get(`/api/v1/menu-items/${menuItemId}`);
    return response.data;
  },
  
  // Create a new menu item
  createMenuItem: async (menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    const response = await api.post('/api/v1/menu-items/', menuItem);
    return response.data;
  },
  
  // Update a menu item
  updateMenuItem: async (menuItemId: string, menuItem: Partial<Omit<MenuItem, 'id' | 'tenant_id' | 'restaurant_id'>>): Promise<MenuItem> => {
    const response = await api.put(`/api/v1/menu-items/${menuItemId}`, menuItem);
    return response.data;
  },
  
  // Delete a menu item
  deleteMenuItem: async (menuItemId: string): Promise<MenuItem> => {
    const response = await api.delete(`/api/v1/menu-items/${menuItemId}`);
    return response.data;
  }
};
