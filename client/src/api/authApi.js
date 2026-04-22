import api from './axiosInstance';

// POST /api/auth/signup
export const signup = (data) => api.post('/api/auth/signup', data);

// POST /api/auth/login
export const login = (data) => api.post('/api/auth/login', data);
