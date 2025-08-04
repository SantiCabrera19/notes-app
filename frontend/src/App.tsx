import { useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NoteEditor } from './components/NoteEditor';
import { NoteViewer } from './components/NoteViewer';
import { Dashboard } from './components/ui/Dashboard';
import { AnimatedBackground } from './components/ui/AnimatedBackground';
import { SuccessMessage } from './components/ui/SuccessMessage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ErrorMessage } from './components/ui/ErrorMessage';
import { useNotes } from './hooks/useNotes';
import { useTags } from './hooks/useTags';
import { useAppState } from './hooks/useAppState';
import { useNoteActions } from './hooks/useNoteActions';
import { getCurrentNotes, findSelectedNote, getAllNotes } from './utils/noteUtils';
import type { Note } from './services/api';

function App() {
  const appState = useAppState();
  const {
    currentView,
    selectedNoteId,
    isCreating,
    isViewing,
    searchQuery,
    selectedTagIds,
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
    setSelectedTagIds,
  } = appState;

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
  } = useNotes();

  const {
    tags,
    loading: tagsLoading,
    error: tagsError,
    clearError: clearTagsError,
  } = useTags();

  const noteActions = useNoteActions(appState.displaySuccessMessage);

  // Cargar notas al montar el componente
  useEffect(() => {
    if (currentView === 'active') {
      fetchActiveNotes();
    } else if (currentView === 'archived') {
      fetchArchivedNotes();
    } else if (currentView === 'all') {
      fetchAllNotes();
    }
  }, [currentView]); // Solo dependemos de currentView

  const handleSaveNote = async (data: any) => {
    try {
      if (isCreating) {
        const newNote = await noteActions.handleSaveNote(data, true);
        if (newNote) {
          appState.handleNoteSelect(newNote.id);
          appState.handleGoHome();
        }
      } else if (selectedNoteId) {
        await noteActions.handleSaveNote(data, false, selectedNoteId);
        appState.handleGoHome();
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await noteActions.handleDeleteNote(id);
      appState.handleGoHome();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleToggleArchive = async (id: string) => {
    try {
      await noteActions.handleToggleArchive(id);
      appState.handleGoHome();
    } catch (error) {
      console.error('Error toggling archive:', error);
    }
  };

  const handleCreateTag = async (name: string) => {
    try {
      return await noteActions.handleCreateTag(name);
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality
  };

  const handleTagFilter = async (tagIds: string[]) => {
    setSelectedTagIds(tagIds);
    // TODO: Implement tag filtering
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

  // Get current notes based on view
  const currentNotes = getCurrentNotes(currentView, activeNotes, archivedNotes, notes);
  
  // Find selected note
  const selectedNote = findSelectedNote(selectedNoteId, notes, activeNotes, archivedNotes);
  
  // Get all notes for dashboard
  // const _allNotes = getAllNotes(activeNotes, archivedNotes);

  return (
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

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 border-r border-gray-800">
          <Sidebar
            notes={currentNotes}
            selectedNoteId={selectedNoteId}
            onNoteSelect={handleNoteSelect}
            view={currentView}
            searchQuery={searchQuery}
            selectedTagIds={selectedTagIds}
            onSearch={handleSearch}
            onTagFilter={handleTagFilter}
            availableTags={tags}
            loading={loading}
            onNotesReorder={handleNotesReorder}
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-900/50 backdrop-blur-sm overflow-hidden">
          {loading && (
            <LoadingSpinner className="h-full" />
          )}

          {(error || tagsError) && (
            <ErrorMessage 
              error={error || tagsError} 
              onClose={() => { clearError(); clearTagsError(); }}
              className="m-4"
            />
          )}

          {!loading && !selectedNoteId && !isCreating && !showDashboard && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 mx-auto mb-6 text-gray-600">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-300 mb-2">
                  Welcome to Notes App
                </h2>
                <p className="text-gray-500 mb-6">
                  Select a note from the sidebar or create a new one to get started.
                </p>
                <button
                  onClick={handleNewNote}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Create Your First Note</span>
                </button>
              </div>
            </div>
          )}

          {/* Note Editor */}
                                {showDashboard && (
                        <Dashboard 
                          notes={[...activeNotes, ...archivedNotes]} 
                          tags={tags} 
                          loading={loading || tagsLoading}
                        />
                      )}
                      {isViewing && selectedNote && (
                        <NoteViewer
                          note={selectedNote}
                          availableTags={tags}
                          onEdit={handleEditNote}
                          onBack={handleGoHome}
                          onDelete={handleDeleteNote}
                          onToggleArchive={handleToggleArchive}
                        />
                      )}
                      {(selectedNoteId || isCreating) && !showDashboard && !isViewing && (
                        <NoteEditor
                          note={selectedNote}
                          isCreating={isCreating}
                          onSave={handleSaveNote}
                          onCancel={handleCancelEdit}
                          onDelete={handleDeleteNote}
                          onToggleArchive={handleToggleArchive}
                          availableTags={tags}
                          onCreateTag={handleCreateTag}
                          onSaveSuccess={handleSaveSuccess}
                          onGoHome={handleGoHome}
                          onView={() => selectedNote && handleViewNote(selectedNote.id)}
                        />
                      )}
        </main>
      </div>
    </AnimatedBackground>
  );
}

export default App;
