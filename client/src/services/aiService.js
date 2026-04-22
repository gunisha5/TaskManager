/**
 * aiService.js
 *
 * Service for AI-powered task suggestions.
 * TODO: Implement as AI Suggest button is built.
 */

import { getAiSuggestions } from '../api/aiApi';

export const aiService = {
  /**
   * Fetch AI tag and subtask suggestions for a given task title.
   * @param {string} title
   * @returns {{ tags: string[], subtasks: string[] }}
   */
  suggest: async (title) => {
    const res = await getAiSuggestions(title);
    return res.data.data; // { tags: [], subtasks: [] }
  },
};
