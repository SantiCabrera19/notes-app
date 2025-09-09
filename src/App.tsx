import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { AppContent } from './components/AppContent';
import { AuthCallback } from './components/AuthCallback';
import { AnimatedBackground } from './components/ui/AnimatedBackground';
import { SuccessMessage } from './components/ui/SuccessMessage';
import { Footer } from './components/ui/Footer';
import { useTags } from './hooks/useTags';
import { useAppState } from './hooks/useAppStateReducer';
import { useNotesManager } from './hooks/useNotesManager';
import type { Note } from './services/api';

function App() {
  const appState = useAppState();
  const {
    currentView,
    selectedNoteId,
    isCreating,
    isViewing,
    searchQuery,
    showSuccessMessage,
    showDashboard,
    handleViewChange,
    handleNewNote,
    handleNoteSelect,
    handleGoHome,
    handleEditNote,
    handleViewNote,
    clearSuccessMessage,
    setSearchQuery,
  } = appState;

  const notesManager = useNotesManager(currentView, appState.displaySuccessMessage);
  const {
    notes,
    activeNotes,
    archivedNotes,
    loading,
    error,
    handleSaveNote,
    handleDeleteNote,
    handleToggleArchive,
    handleCreateTag,
    refreshCurrentView,
    clearError,
  } = notesManager;

  const {
    tags,
    loading: tagsLoading,
    error: tagsError,
    clearError: clearTagsError,
  } = useTags();

  // Cargar notas iniciales y cuando cambia la vista
  useEffect(() => {
    refreshCurrentView();
  }, [currentView, refreshCurrentView]);


  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNotesReorder = (_reorderedNotes: Note[]) => {
    // TODO: Implement notes reordering persistence
  };

  const handleCancelEdit = () => {
    appState.resetAppState();
  };

  const handleSaveSuccess = () => {
    appState.handleGoHome();
  };

  return (
    <Router>
      <Routes>
        {/* Auth Callback Route */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Main App Route */}
        <Route path="/" element={
          <AnimatedBackground variant="gradient">
            {/* Header */}
            <Header
              title="Notes App"
              currentView={currentView}
              onViewChange={handleViewChange}
              onCreateNote={handleNewNote}
              onGoHome={handleGoHome}
            />

            {/* Success Message */}
            <SuccessMessage 
              message={showSuccessMessage} 
              onClose={clearSuccessMessage} 
            />

            {/* Main Content */}
            <AppContent
              // Estado
              currentView={currentView}
              selectedNoteId={selectedNoteId}
              isCreating={isCreating}
              isViewing={isViewing}
              searchQuery={searchQuery}
              showDashboard={showDashboard}
              
              // Datos
              notes={notes}
              activeNotes={activeNotes}
              archivedNotes={archivedNotes}
              tags={tags}
              loading={loading || tagsLoading}
              error={error}
              tagsError={tagsError}
              
              // Acciones de notas
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              onToggleArchive={handleToggleArchive}
              onCreateTag={handleCreateTag}
              
              // Acciones de UI
              onNoteSelect={handleNoteSelect}
              onEditNote={handleEditNote}
              onViewNote={handleViewNote}
              onGoHome={handleGoHome}
              onViewChange={handleViewChange}
              onCreateNote={handleNewNote}
              onSearch={handleSearch}
              onNotesReorder={handleNotesReorder}
              onCancelEdit={handleCancelEdit}
              onSaveSuccess={handleSaveSuccess}
              clearError={clearError}
              clearTagsError={clearTagsError}
            />
            {/* Footer */}
            <Footer />
          </AnimatedBackground>
        } />
        
        {/* Redirect any other routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
