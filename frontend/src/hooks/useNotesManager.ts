import { useCallback } from 'react';
import { useUnifiedNotes } from './useUnifiedNotes';
import { useNoteActions } from './useNoteActions';
import type { ViewType } from './useAppState';

/**
 * Hook centralizado para manejar todas las operaciones de notas
 * Elimina la lógica duplicada y optimiza re-renders
 */
export const useNotesManager = (
  currentView: ViewType,
  displaySuccessMessage: (message: string) => void
) => {
  const {
    notes,
    activeNotes,
    archivedNotes,
    loading,
    error,
    fetchActiveNotes,
    fetchArchivedNotes,
    fetchAllNotes,
    clearError,
    isAuthenticated,
  } = useUnifiedNotes();

  const noteActions = useNoteActions(displaySuccessMessage);

  // Función optimizada para refrescar notas según la vista actual
  const refreshCurrentView = useCallback(() => {
    switch (currentView) {
      case 'active':
        fetchActiveNotes();
        break;
      case 'archived':
        fetchArchivedNotes();
        break;
      case 'all':
        fetchAllNotes();
        break;
    }
  }, [currentView, fetchActiveNotes, fetchArchivedNotes, fetchAllNotes]);

  // Operaciones optimizadas que auto-refrescan
  const handleSaveNote = useCallback(async (
    data: any,
    isCreating: boolean,
    selectedNoteId?: string
  ) => {
    try {
      let result;
      if (isCreating) {
        result = await noteActions.handleSaveNote(data, true);
      } else if (selectedNoteId) {
        result = await noteActions.handleSaveNote(data, false, selectedNoteId);
      }
      
      // Auto-refresh después de guardar
      refreshCurrentView();
      return result;
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  }, [noteActions, refreshCurrentView]);

  const handleDeleteNote = useCallback(async (id: string) => {
    try {
      await noteActions.handleDeleteNote(id);
      refreshCurrentView();
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }, [noteActions, refreshCurrentView]);

  const handleToggleArchive = useCallback(async (id: string) => {
    try {
      await noteActions.handleToggleArchive(id);
      refreshCurrentView();
    } catch (error) {
      console.error('Error toggling archive:', error);
      throw error;
    }
  }, [noteActions, refreshCurrentView]);

  const handleCreateTag = useCallback(async (name: string) => {
    try {
      return await noteActions.handleCreateTag(name);
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }, [noteActions]);

  return {
    // Estado
    notes,
    activeNotes,
    archivedNotes,
    loading,
    error,
    isAuthenticated,
    
    // Acciones optimizadas
    handleSaveNote,
    handleDeleteNote,
    handleToggleArchive,
    handleCreateTag,
    refreshCurrentView,
    clearError,
  };
};
