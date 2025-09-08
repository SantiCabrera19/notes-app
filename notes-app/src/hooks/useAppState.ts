import { useState, useCallback } from 'react';


export type ViewType = 'active' | 'archived' | 'all';

export const useAppState = () => {
  const [currentView, setCurrentView] = useState<ViewType>('active');
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>();
  const [isCreating, setIsCreating] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(true);

  const resetAppState = useCallback(() => {
    setSelectedNoteId(undefined);
    setIsCreating(false);
    setIsViewing(false);
    setSearchQuery('');
    setSelectedTagIds([]);
  }, []);

  const handleViewChange = useCallback((view: ViewType) => {
    setCurrentView(view);
    resetAppState();
  }, [resetAppState]);

  const handleNewNote = useCallback(() => {
    setIsCreating(true);
    setSelectedNoteId(undefined);
    setShowDashboard(false);
  }, []);

  const handleNoteSelect = useCallback((noteId: string) => {
    setSelectedNoteId(noteId);
    setIsCreating(false);
    setIsViewing(true);
    setShowDashboard(false);
  }, []);

  const handleGoHome = useCallback(() => {
    setShowDashboard(true);
    resetAppState();
  }, [resetAppState]);

  const handleEditNote = useCallback(() => {
    setIsViewing(false);
    setIsCreating(false);
  }, []);

  const handleViewNote = useCallback((noteId: string) => {
    setSelectedNoteId(noteId);
    setIsViewing(true);
    setIsCreating(false);
    setShowDashboard(false);
  }, []);

  const displaySuccessMessage = useCallback((message: string) => {
    setShowSuccessMessage(message);
    setTimeout(() => setShowSuccessMessage(null), 3000);
  }, []);

  const clearSuccessMessage = useCallback(() => {
    setShowSuccessMessage(null);
  }, []);

  return {
    // State
    currentView,
    selectedNoteId,
    isCreating,
    isViewing,
    searchQuery,
    selectedTagIds,
    showSuccessMessage,
    showDashboard,
    
    // Actions
    handleViewChange,
    handleNewNote,
    handleNoteSelect,
    handleGoHome,
    handleEditNote,
    handleViewNote,
    displaySuccessMessage,
    clearSuccessMessage,
    setSearchQuery,
    setSelectedTagIds,
    setShowDashboard,
    resetAppState,
  };
}; 