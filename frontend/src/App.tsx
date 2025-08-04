import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NoteEditor } from './components/NoteEditor';
import { useNotes } from './hooks/useNotes';
import { useTags } from './hooks/useTags';
import type { Note } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState<'active' | 'archived' | 'all'>('active');
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>();
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);

  const {
    notes,
    activeNotes,
    archivedNotes,
    loading,
    error,
    fetchActiveNotes,
    fetchArchivedNotes,
    fetchAllNotes,
    createNote,
    updateNote,
    deleteNote,
    toggleArchiveNote,
    searchNotes,
    getNotesByTags,
    clearError,
  } = useNotes();

  const {
    tags,
    loading: tagsLoading,
    error: tagsError,
    createTag,
    clearError: clearTagsError,
  } = useTags();

  // Cargar notas al montar el componente
  useEffect(() => {
    if (currentView === 'active') {
      fetchActiveNotes();
    } else if (currentView === 'archived') {
      fetchArchivedNotes();
    } else if (currentView === 'all') {
      fetchAllNotes();
    }
  }, [currentView]);

  const handleViewChange = (view: 'active' | 'archived' | 'all') => {
    setCurrentView(view);
    setSelectedNoteId(undefined);
    setIsCreating(false);
    setSearchQuery('');
    setSelectedTagIds([]);
  };

  const handleNewNote = () => {
    setIsCreating(true);
    setSelectedNoteId(undefined);
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsCreating(false);
  };

  const handleSaveNote = async (data: any) => {
    try {
      if (isCreating) {
        const newNote = await createNote(data);
        setSelectedNoteId(newNote.id);
        setIsCreating(false);
        setShowSuccessMessage('Note created successfully! 🎉');
        setTimeout(() => setShowSuccessMessage(null), 3000);
      } else if (selectedNoteId) {
        await updateNote(selectedNoteId, data);
        setShowSuccessMessage('Note updated successfully! ✨');
        setTimeout(() => setShowSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleSaveSuccess = () => {
    // Redirect to list view after successful save
    setSelectedNoteId(undefined);
    setIsCreating(false);
  };

  const handleCancelEdit = () => {
    setIsCreating(false);
    setSelectedNoteId(undefined);
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      setSelectedNoteId(undefined);
      setShowSuccessMessage('Note deleted successfully! 🗑️');
      setTimeout(() => setShowSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleToggleArchive = async (id: string) => {
    try {
      const updatedNote = await toggleArchiveNote(id);
      setSelectedNoteId(undefined);
      const action = updatedNote.isArchived ? 'archived' : 'unarchived';
      setShowSuccessMessage(`Note ${action} successfully! 📁`);
      setTimeout(() => setShowSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error toggling archive:', error);
    }
  };

  const handleCreateTag = async (name: string) => {
    try {
      return await createTag({ name });
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Implementar búsqueda
      console.log('Searching for:', query);
    }
  };

  const handleTagFilter = async (tagIds: string[]) => {
    setSelectedTagIds(tagIds);
    if (tagIds.length > 0) {
      // Implementar filtro por tags
      console.log('Filtering by tags:', tagIds);
    }
  };

  const getCurrentNotes = () => {
    switch (currentView) {
      case 'active':
        return activeNotes;
      case 'archived':
        return archivedNotes;
      case 'all':
        return notes;
      default:
        return activeNotes;
    }
  };

  // Buscar la nota seleccionada en todas las listas
  const selectedNote = selectedNoteId 
    ? notes.find(note => note.id === selectedNoteId) ||
      activeNotes.find(note => note.id === selectedNoteId) ||
      archivedNotes.find(note => note.id === selectedNoteId)
    : undefined;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <Header
        title="Notes App"
        currentView={currentView}
        onViewChange={handleViewChange}
        onCreateNote={handleNewNote}
      />

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in slide-in-from-right">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{showSuccessMessage}</span>
          <button
            onClick={() => setShowSuccessMessage(null)}
            className="ml-2 text-green-200 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 border-r border-gray-800">
          <Sidebar
            notes={getCurrentNotes()}
            selectedNoteId={selectedNoteId}
            onNoteSelect={handleNoteSelect}
            view={currentView}
            searchQuery={searchQuery}
            selectedTagIds={selectedTagIds}
            onSearch={handleSearch}
            onTagFilter={handleTagFilter}
            availableTags={tags}
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-900 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span>Loading...</span>
              </div>
            </div>
          )}

          {(error || tagsError) && (
            <div className="m-4 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span>{error || tagsError}</span>
                <button
                  onClick={() => { clearError(); clearTagsError(); }}
                  className="text-red-300 hover:text-red-100 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {!loading && !selectedNoteId && !isCreating && (
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
          {(selectedNoteId || isCreating) && (
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
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
