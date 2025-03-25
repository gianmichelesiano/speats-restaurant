import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { Task } from '../features/tasks/data/schema';

const baseURL = 'http://localhost:8000';

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

// Tasks API functions
export const tasksApi = {
  // Get all tasks
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get('/api/tasks/');
    return response.data;
  },
  
  // Get a single task
  getTask: async (taskId: string): Promise<Task> => {
    const response = await api.get(`/api/tasks/${taskId}`);
    return response.data;
  },
  
  // Create a new task
  createTask: async (task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await api.post('/api/tasks/', task);
    return response.data;
  },
  
  // Update a task
  updateTask: async (taskId: string, task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await api.put(`/api/tasks/${taskId}`, task);
    return response.data;
  },
  
  // Delete a task
  deleteTask: async (taskId: string): Promise<Task> => {
    const response = await api.delete(`/api/tasks/${taskId}`);
    return response.data;
  }
};
