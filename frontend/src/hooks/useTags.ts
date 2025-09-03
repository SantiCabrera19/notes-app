import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { Tag, CreateTagRequest, UpdateTagRequest } from '../services/api';

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTags = await apiService.getAllTags();
      setTags(Array.isArray(fetchedTags) ? fetchedTags : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTag = useCallback(async (data: CreateTagRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newTag = await apiService.createTag(data);
      setTags(prev => [...prev, newTag]);
      return newTag;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tag');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTag = useCallback(async (id: string, data: UpdateTagRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTag = await apiService.updateTag(id, data);
      setTags(prev => prev.map(tag => tag.id === id ? updatedTag : tag));
      return updatedTag;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tag');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTag = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteTag(id);
      setTags(prev => prev.filter(tag => tag.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tag');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Load tags on mount
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    clearError,
  };
}; 