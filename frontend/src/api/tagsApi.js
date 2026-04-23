import api from './axiosInstance';

// GET /api/tags
export const getTags = () => api.get(`${import.meta.env.VITE_API_URL}/api/tags`);

// POST /api/tags
export const createTag = (data) => api.post(`${import.meta.env.VITE_API_URL}/api/tags`, data);

// PUT /api/tags/:id
export const renameTag = (id, data) => api.put(`${import.meta.env.VITE_API_URL}/api/tags/${id}`, data);

// DELETE /api/tags/:id
export const deleteTag = (id) => api.delete(`${import.meta.env.VITE_API_URL}/api/tags/${id}`);
