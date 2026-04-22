import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';

/**
 * useTasks — fetches the authenticated user's tasks from the API.
 *
 * @param {object} filters  - Optional query params: { status, priority, tags, search }
 * @returns {{ tasks, loading, error, refetch }}
 */
const useTasks = (filters = {}) => {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAll(filters);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load tasks. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks, setTasks };
};

export default useTasks;
