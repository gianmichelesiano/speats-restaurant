import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { z } from 'zod';

// Schema for restaurant data
export const restaurantSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  phone: z.string().optional(),
  opening_hours: z.string().optional(),
  logo_image: z.string().optional(),
  description: z.string().optional(),
  tenant_id: z.string(),
});

export type Restaurant = z.infer<typeof restaurantSchema>;

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

// Restaurants API functions
export const restaurantsApi = {
  // Get all restaurants
  getAllRestaurants: async (tenantId?: string): Promise<Restaurant[]> => {
    const params = tenantId ? { tenant_id: tenantId } : {};
    const response = await api.get('/api/v1/restaurants/', { params });
    return response.data;
  },
  
  // Get a single restaurant
  getRestaurant: async (restaurantId: string): Promise<Restaurant> => {
    const response = await api.get(`/api/v1/restaurants/${restaurantId}`);
    return response.data;
  },
  
  // Create a new restaurant
  createRestaurant: async (restaurant: Omit<Restaurant, 'id'>): Promise<Restaurant> => {
    const response = await api.post('/api/v1/restaurants/', restaurant);
    return response.data;
  },
  
  // Update a restaurant
  updateRestaurant: async (restaurantId: string, restaurant: Partial<Omit<Restaurant, 'id' | 'tenant_id'>>): Promise<Restaurant> => {
    const response = await api.put(`/api/v1/restaurants/${restaurantId}`, restaurant);
    return response.data;
  },
  
  // Delete a restaurant
  deleteRestaurant: async (restaurantId: string): Promise<Restaurant> => {
    const response = await api.delete(`/api/v1/restaurants/${restaurantId}`);
    return response.data;
  }
};
