import api from './axiosInstance';

// POST /api/ai/suggest
// Input: { title: string }
// Output: { tags: [], subtasks: [] }
export const getAiSuggestions = (title) => api.post(`${import.meta.env.VITE_API_URL}/api/ai/suggest`, { title });
