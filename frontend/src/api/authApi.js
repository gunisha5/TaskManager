import api from './axiosInstance';

// POST /api/auth/signup
export const signup = (data) => api.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, data);

// POST /api/auth/login
export const login = (data) => api.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, data);
