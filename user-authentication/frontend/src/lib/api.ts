// API client configuration and utilities

import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081',
  timeout: 10000,
  withCredentials: true, // Important for cookie-based authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      // Forbidden
      toast.error('Access denied');
    } else if (error.response?.status >= 500) {
      // Server error
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      toast.error('Request timeout. Please try again.');
    } else if (!error.response) {
      // Network error
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

export default api;

// API endpoint helpers
export const endpoints = {
  // Authentication
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
  },
  
  // Posts
  posts: {
    list: '/api/posts',
    create: '/api/posts',
    get: (id: number) => `/api/posts/${id}`,
    update: (id: number) => `/api/posts/${id}`,
    delete: (id: number) => `/api/posts/${id}`,
    byUser: (userId: number) => `/api/users/${userId}/posts`,
  },
  
  // Users
  users: {
    list: '/api/users',
    get: (id: number) => `/api/users/${id}`,
    profile: '/api/users/profile',
  },
  
  // Chat (future implementation)
  chat: {
    conversations: '/api/chat/conversations',
    messages: (userId: number) => `/api/chat/messages/${userId}`,
    send: '/api/chat/send',
  },
  
  // Health check
  health: '/health',
};

// Error handling utility
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    return message;
  }
  return 'An unexpected error occurred';
};