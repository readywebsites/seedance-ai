import { create } from 'zustand';
import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

// Create Axios instance with JWT interceptors
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('No refresh token available');
        
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh });
        const { access } = response.data;
        
        localStorage.setItem('access_token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (e) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('access_token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login/', { email, password });
      const { access, refresh, user } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ 
        accessToken: access, 
        refreshToken: refresh, 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null
      });
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.detail || err.response?.data?.error || 'Invalid credentials or backend offline.';
      set({ isLoading: false, error: errMsg });
      throw new Error(errMsg);
    }
  },

  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/register/', { email, password, name });
      set({ isLoading: false, error: null });
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.email?.[0] || err.response?.data?.detail || 'Registration failed.';
      set({ isLoading: false, error: errMsg });
      throw new Error(errMsg);
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, error: null });
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/forgot-password/', { email });
      set({ isLoading: false });
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to dispatch request.';
      set({ isLoading: false, error: errMsg });
      throw new Error(errMsg);
    }
  },

  verifyEmail: async (token) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/verify-email/', { token });
      set({ isLoading: false });
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Token verification failed.';
      set({ isLoading: false, error: errMsg });
      throw new Error(errMsg);
    }
  },

  fetchProfile: async () => {
    try {
      const response = await api.get('/profile/');
      set({ user: response.data });
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (err) {
      console.error('Failed to sync profile with database.', err);
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put('/profile/', data);
      set({ user: response.data, isLoading: false, error: null });
      localStorage.setItem('user', JSON.stringify(response.data));
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to save settings.';
      set({ isLoading: false, error: errMsg });
      throw new Error(errMsg);
    }
  },

  deductCredits: (amount) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, credits: Math.max(0, currentUser.credits - amount) };
      set({ user: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  },
  
  addCredits: (amount) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, credits: currentUser.credits + amount };
      set({ user: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }
}));
