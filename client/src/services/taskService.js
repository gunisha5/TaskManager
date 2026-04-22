/**
 * taskService.js
 *
 * Business logic layer for task operations.
 * TODO: Implement as Dashboard UI is built.
 */

import { getTasks, createTask, updateTask, deleteTask, markTaskDone } from '../api/tasksApi';

export const taskService = {
  getAll: async (filters = {}) => {
    const res = await getTasks(filters);
    return res.data.data; // array of tasks
  },

  create: async (taskData) => {
    const res = await createTask(taskData);
    return res.data.data;
  },

  update: async (id, taskData) => {
    const res = await updateTask(id, taskData);
    return res.data.data;
  },

  delete: async (id) => {
    const res = await deleteTask(id);
    return res.data;
  },

  markDone: async (id) => {
    const res = await markTaskDone(id);
    return res.data.data;
  },
};
