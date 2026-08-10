import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('classconnect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const getHealthCheck = async () => {
  const res = await api.get('/health');
  return res.data;
};

export const registerApi = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

export const loginApi = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const getMeApi = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const forgotPasswordApi = async (data) => {
  const res = await api.post('/auth/forgot-password', data);
  return res.data;
};

export const resetPasswordApi = async (data) => {
  const res = await api.post('/auth/reset-password', data);
  return res.data;
};

export default api;
