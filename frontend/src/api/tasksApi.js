import api from './axiosInstance';

// GET /api/tasks (supports query params: status, priority, tags, search)
export const getTasks = (params) => api.get(`${import.meta.env.VITE_API_URL}/api/tasks`, { params });

// POST /api/tasks
export const createTask = (data) => api.post(`${import.meta.env.VITE_API_URL}/api/tasks`, data);

// PATCH /api/tasks/:id
export const updateTask = (id, data) => api.patch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, data);

// DELETE /api/tasks/:id
export const deleteTask = (id) => api.delete(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`);

// PATCH /api/tasks/:id/done
export const markTaskDone = (id) => api.patch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}/done`);
