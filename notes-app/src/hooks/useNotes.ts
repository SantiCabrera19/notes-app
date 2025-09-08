import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import type { Note, CreateNoteRequest, UpdateNoteRequest } from '../services/api';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNotes, setActiveNotes] = useState<Note[]>([]);
  const [archivedNotes, setArchivedNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedNotes = await apiService.getAllNotes();
      setNotes(Array.isArray(fetchedNotes) ? fetchedNotes : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActiveNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedNotes = await apiService.getActiveNotes();
      setActiveNotes(Array.isArray(fetchedNotes) ? fetchedNotes : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch active notes');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchArchivedNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedNotes = await apiService.getArchivedNotes();
      setArchivedNotes(Array.isArray(fetchedNotes) ? fetchedNotes : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch archived notes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (data: CreateNoteRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newNote = await apiService.createNote(data);
      setNotes(prev => [newNote, ...prev]);
      setActiveNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNote = useCallback(async (id: string, data: UpdateNoteRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedNote = await apiService.updateNote(id, data);
      setNotes(prev => prev.map(note => note.id === id ? updatedNote : note));
      setActiveNotes(prev => prev.map(note => note.id === id ? updatedNote : note));
      setArchivedNotes(prev => prev.map(note => note.id === id ? updatedNote : note));
      return updatedNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteNote(id);
      setNotes(prev => prev.filter(note => note.id !== id));
      setActiveNotes(prev => prev.filter(note => note.id !== id));
      setArchivedNotes(prev => prev.filter(note => note.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleArchiveNote = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedNote = await apiService.toggleArchiveNote(id);
      setNotes(prev => prev.map(note => note.id === id ? updatedNote : note));
      setActiveNotes(prev => prev.filter(note => note.id !== id));
      setArchivedNotes(prev => prev.filter(note => note.id !== id));
      
      if (updatedNote.isArchived) {
        setArchivedNotes(prev => [updatedNote, ...prev]);
      } else {
        setActiveNotes(prev => [updatedNote, ...prev]);
      }
      
      return updatedNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle archive note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchNotes = useCallback(async (query: string, archived?: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const searchResults = await apiService.searchNotes(query, archived);
      return Array.isArray(searchResults) ? searchResults : [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search notes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getNotesByTags = useCallback(async (tagIds: string[], archived?: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const filteredNotes = await apiService.getNotesByTags(tagIds, archived);
      return Array.isArray(filteredNotes) ? filteredNotes : [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get notes by tags');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    notes,
    activeNotes,
    archivedNotes,
    loading,
    error,
    fetchAllNotes,
    fetchActiveNotes,
    fetchArchivedNotes,
    createNote,
    updateNote,
    deleteNote,
    toggleArchiveNote,
    searchNotes,
    getNotesByTags,
    clearError,
  };
}; 