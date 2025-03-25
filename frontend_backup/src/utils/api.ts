import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

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

// Flag to prevent infinite refresh loops
let isRefreshing = false;

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If we get a 401 Unauthorized error and we're not already refreshing, try to refresh the user data
    if (error.response && error.response.status === 401 && !isRefreshing) {
      try {
        isRefreshing = true;
        
        // Check if the request URL is from Supabase auth endpoints to prevent loops
        const isSupabaseAuthRequest = error.config.url?.includes('/auth/v1/user');
        if (isSupabaseAuthRequest) {
          // Don't try to refresh for Supabase auth requests
          isRefreshing = false;
          return Promise.reject(error);
        }
        
        // Try to refresh user data
        await useAuthStore.getState().auth.fetchUserData();
        
        // If successful, retry the original request
        const token = useAuthStore.getState().auth.accessToken;
        if (token) {
          error.config.headers.Authorization = `Bearer ${token}`;
          isRefreshing = false;
          return axios(error.config);
        }
      } catch (refreshError) {
        console.error('Error refreshing user data:', refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// Chat API functions
export const chatApi = {
  // Sessions
  getAllChatSessions: async () => {
    const response = await api.get('/api/sessions');
    return response.data;
  },
  
  getChatSession: async (sessionId: string) => {
    const response = await api.get(`/api/sessions/${sessionId}`);
    return response.data;
  },
  
  updateChatSessionTitle: async (sessionId: string, title: string) => {
    const response = await api.patch(`/api/sessions/${sessionId}/title`, { title });
    return response.data;
  },
  
  deleteChatSession: async (sessionId: string) => {
    const response = await api.delete(`/api/sessions/${sessionId}`);
    return response.data;
  },
  
  // User profile
  getMyProfile: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  },
  
  // Stripe integration
  createCheckoutSession: async (priceId: string, email: string) => {
    const response = await api.post('/api/create-checkout-session', {
      priceId,
      email,
      successUrl: window.location.origin + '/settings/subscription',
      cancelUrl: window.location.origin + '/settings/subscription'
    });
    return response.data;
  },
  
  cancelSubscription: async () => {
    const response = await api.put('/api/cancel-subscription');
    return response.data;
  }
};
