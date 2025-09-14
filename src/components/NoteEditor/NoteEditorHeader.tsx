import { memo } from 'react';
import type { Note } from '../../services/api';

interface NoteEditorHeaderProps {
  isCreating: boolean;
  note?: Note;
  onGoHome?: () => void;
  onView?: () => void;
  onToggleArchive?: () => void;
  onDelete?: () => void;
}

export const NoteEditorHeader = memo<NoteEditorHeaderProps>(({
  isCreating,
  note,
  onGoHome,
  onView,
  onToggleArchive,
  onDelete,
}) => (
  <div className="p-4 md:p-6 border-b border-gray-800 bg-gray-900">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <button
          onClick={onGoHome}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          title="Back to Dashboard"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <h2 className="text-lg md:text-xl font-semibold text-white">
          {isCreating ? 'Create New Note' : 'Edit Note'}
        </h2>
        <span className="hidden md:inline text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
          Ctrl+S to save • Esc to cancel
        </span>
      </div>
      <div className="flex items-center justify-end space-x-2">
        {note && onView && (
          <button
            onClick={onView}
            className="p-2 md:px-3 md:py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="hidden md:inline">View</span>
          </button>
        )}
        {note && onToggleArchive && (
          <button
            onClick={onToggleArchive}
            className="p-2 md:px-3 md:py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span className="hidden md:inline">{note.isArchived ? 'Unarchive' : 'Archive'}</span>
          </button>
        )}
        {note && onDelete && (
          <button
            onClick={onDelete}
            className="p-2 md:px-3 md:py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden md:inline">Delete</span>
          </button>
        )}
      </div>
    </div>
  </div>
));
