import api from './axiosInstance';

// POST /api/ai/suggest
// Input: { title: string }
// Output: { tags: [], subtasks: [] }
export const getAiSuggestions = (title) => api.post('/api/ai/suggest', { title });
