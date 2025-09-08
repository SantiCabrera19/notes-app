import { memo } from 'react';
import { Sidebar } from './Sidebar';
import { NoteEditor } from './NoteEditor';
import { NoteViewer } from './NoteViewer';
import { Dashboard } from './ui/Dashboard';
import { SidebarSkeleton, DashboardSkeleton } from './ui/Skeleton';
import { ErrorMessage } from './ui/ErrorMessage';
import { getCurrentNotes, findSelectedNote } from '../utils/noteUtils';
import type { Note, Tag } from '../services/api';
import type { ViewType } from '../hooks/useAppStateReducer';

interface AppContentProps {
  // Estado
  currentView: ViewType;
  selectedNoteId?: string;
  isCreating: boolean;
  isViewing: boolean;
  searchQuery: string;
  showDashboard: boolean;
  
  // Datos
  notes: Note[];
  activeNotes: Note[];
  archivedNotes: Note[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
  tagsError: string | null;
  
  // Acciones de notas
  onSaveNote: (data: any, isCreating: boolean, selectedNoteId?: string) => Promise<any>;
  onDeleteNote: (id: string) => Promise<void>;
  onToggleArchive: (id: string) => Promise<void>;
  onCreateTag: (name: string) => Promise<any>;
  
  // Acciones de UI
  onNoteSelect: (noteId: string) => void;
  onEditNote: () => void;
  onViewNote: (noteId: string) => void;
  onGoHome: () => void;
  onSearch: (query: string) => void;
  onNotesReorder: (notes: Note[]) => void;
  onCancelEdit: () => void;
  onSaveSuccess: () => void;
  clearError: () => void;
  clearTagsError: () => void;
}

/**
 * Componente principal del contenido de la aplicación
 * Separado de App.tsx para mejor organización y performance
 */
export const AppContent = memo<AppContentProps>(({
  // Estado
  currentView,
  selectedNoteId,
  isCreating,
  isViewing,
  searchQuery,
  showDashboard,
  
  // Datos
  notes,
  activeNotes,
  archivedNotes,
  tags,
  loading,
  error,
  tagsError,
  
  // Acciones de notas
  onSaveNote,
  onDeleteNote,
  onToggleArchive,
  onCreateTag,
  
  // Acciones de UI
  onNoteSelect,
  onEditNote,
  onViewNote,
  onGoHome,
  onSearch,
  onNotesReorder,
  onCancelEdit,
  onSaveSuccess,
  clearError,
  clearTagsError,
}) => {
  // Obtener notas actuales y nota seleccionada
  const currentNotes = getCurrentNotes(currentView, activeNotes, archivedNotes, notes);
  const selectedNote = findSelectedNote(selectedNoteId, notes, activeNotes, archivedNotes);

  // Manejar guardado de notas
  const handleSaveNote = async (data: any) => {
    try {
      const result = await onSaveNote(data, isCreating, selectedNoteId);
      if (result && isCreating) {
        onNoteSelect(result.id);
      }
      onGoHome();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Manejar eliminación de notas
  const handleDeleteNote = async (id: string) => {
    try {
      await onDeleteNote(id);
      onGoHome();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Manejar toggle de archivo
  const handleToggleArchive = async (id: string) => {
    try {
      await onToggleArchive(id);
      onGoHome();
    } catch (error) {
      console.error('Error toggling archive:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-full md:w-80 md:flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-800 max-h-[40vh] md:max-h-none overflow-auto md:overflow-visible">
        {loading ? (
          <SidebarSkeleton />
        ) : (
          <Sidebar
            notes={currentNotes}
            selectedNoteId={selectedNoteId}
            onNoteSelect={onNoteSelect}
            view={currentView}
            searchQuery={searchQuery}
            onSearch={onSearch}
            loading={loading}
            onNotesReorder={onNotesReorder}
          />
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 bg-gray-900/50 backdrop-blur-sm overflow-auto scroll-smooth">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Error State */}
            {(error || tagsError) && (
              <ErrorMessage 
                error={error || tagsError} 
                onClose={() => { 
                  clearError(); 
                  clearTagsError(); 
                }}
                className="m-4"
              />
            )}

            {/* Welcome State */}
            {!selectedNoteId && !isCreating && !showDashboard && (
              <WelcomeScreen onCreateNote={onGoHome} />
            )}

            {/* Dashboard */}
            {showDashboard && (
              <Dashboard 
                notes={[...(activeNotes || []), ...(archivedNotes || [])]} 
                tags={tags} 
                loading={false}
              />
            )}

            {/* Note Viewer */}
            {isViewing && selectedNote && (
              <NoteViewer
                note={selectedNote}
                availableTags={tags}
                onEdit={onEditNote}
                onBack={onGoHome}
                onDelete={handleDeleteNote}
                onToggleArchive={handleToggleArchive}
              />
            )}

            {/* Note Editor */}
            {(selectedNoteId || isCreating) && !showDashboard && !isViewing && (
              <NoteEditor
                note={selectedNote}
                isCreating={isCreating}
                onSave={handleSaveNote}
                onCancel={onCancelEdit}
                onDelete={handleDeleteNote}
                onToggleArchive={handleToggleArchive}
                availableTags={tags}
                onCreateTag={onCreateTag}
                onSaveSuccess={onSaveSuccess}
                onGoHome={onGoHome}
                onView={() => selectedNote && onViewNote(selectedNote.id)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
});

AppContent.displayName = 'AppContent';

/**
 * Componente de bienvenida memoizado
 */
const WelcomeScreen = memo<{ onCreateNote: () => void }>(({ onCreateNote }) => (
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
        onClick={onCreateNote}
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
));

WelcomeScreen.displayName = 'WelcomeScreen';
