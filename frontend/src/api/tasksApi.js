import api from './axiosInstance';

// GET /api/tasks (supports query params: status, priority, tags, search)
export const getTasks = (params) => api.get('/api/tasks', { params });

// POST /api/tasks
export const createTask = (data) => api.post('/api/tasks', data);

// PATCH /api/tasks/:id
export const updateTask = (id, data) => api.patch(`/api/tasks/${id}`, data);

// DELETE /api/tasks/:id
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);

// PATCH /api/tasks/:id/done
export const markTaskDone = (id) => api.patch(`/api/tasks/${id}/done`);
