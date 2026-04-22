import { useState, useEffect, useCallback } from 'react';
import { tagService } from '../services/tagService';

const useTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tagService.getAll();
      setTags(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load tags.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return { tags, loading, error, refetch: fetchTags, setTags };
};

export default useTags;
