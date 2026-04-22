import api from './axiosInstance';

// GET /api/tasks (supports query params: status, priority, tags, search)
export const getTasks = (params) => api.get('/tasks', { params });

// POST /api/tasks
export const createTask = (data) => api.post('/tasks', data);

// PATCH /api/tasks/:id
export const updateTask = (id, data) => api.patch(`/tasks/${id}`, data);

// DELETE /api/tasks/:id
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// PATCH /api/tasks/:id/done
export const markTaskDone = (id) => api.patch(`/tasks/${id}/done`);
