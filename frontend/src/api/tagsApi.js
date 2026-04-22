import api from './axiosInstance';

// GET /api/tags
export const getTags = () => api.get('/tags');

// POST /api/tags
export const createTag = (data) => api.post('/tags', data);

// PUT /api/tags/:id
export const renameTag = (id, data) => api.put(`/tags/${id}`, data);

// DELETE /api/tags/:id
export const deleteTag = (id) => api.delete(`/tags/${id}`);
