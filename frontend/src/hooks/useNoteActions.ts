import { useCallback } from 'react';
import { useUnifiedNotes } from './useUnifiedNotes';
import { useTags } from './useTags';
import type { CreateNoteRequest, UpdateNoteRequest } from '../services/api';

export const useNoteActions = (showSuccessMessage: (message: string) => void) => {
  const {
    createNote,
    updateNote,
    deleteNote,
    toggleArchive,
  } = useUnifiedNotes();

  const { createTag } = useTags();

  const handleSaveNote = useCallback(async (data: CreateNoteRequest | UpdateNoteRequest, isCreating: boolean, selectedNoteId?: string) => {
    try {
      if (isCreating) {
        const newNote = await createNote(data as CreateNoteRequest);
        showSuccessMessage('Note created successfully! 🎉');
        return newNote;
      } else if (selectedNoteId) {
        await updateNote(selectedNoteId, data as UpdateNoteRequest);
        showSuccessMessage('Note updated successfully! ✨');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  }, [createNote, updateNote, showSuccessMessage]);

  const handleDeleteNote = useCallback(async (id: string) => {
    try {
      await deleteNote(id);
      showSuccessMessage('Note deleted successfully! 🗑️');
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }, [deleteNote, showSuccessMessage]);

  const handleToggleArchive = useCallback(async (id: string) => {
    try {
      const updatedNote = await toggleArchive(id);
      const action = updatedNote.isArchived ? 'archived' : 'unarchived';
      showSuccessMessage(`Note ${action} successfully! 📁`);
      return updatedNote;
    } catch (error) {
      console.error('Error toggling archive:', error);
      throw error;
    }
  }, [toggleArchive, showSuccessMessage]);

  const handleCreateTag = useCallback(async (name: string) => {
    try {
      return await createTag({ name });
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }, [createTag]);

  return {
    handleSaveNote,
    handleDeleteNote,
    handleToggleArchive,
    handleCreateTag,
  };
}; 