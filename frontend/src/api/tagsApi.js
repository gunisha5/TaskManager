import api from './axiosInstance';

// GET /api/tags
export const getTags = () => api.get('/api/tags');

// POST /api/tags
export const createTag = (data) => api.post('/api/tags', data);

// PUT /api/tags/:id
export const renameTag = (id, data) => api.put(`/api/tags/${id}`, data);

// DELETE /api/tags/:id
export const deleteTag = (id) => api.delete(`/api/tags/${id}`);
