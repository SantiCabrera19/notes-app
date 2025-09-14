import { memo } from 'react';

interface NoteEditorActionsProps {
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  canSave: boolean;
}

export const NoteEditorActions = memo<NoteEditorActionsProps>(({
  isSaving,
  onSave,
  onCancel,
  canSave,
}) => (
  <div className="p-4 md:p-6 border-t border-gray-800 bg-gray-900">
    <div className="flex flex-col md:flex-row justify-end space-y-3 md:space-y-0 md:space-x-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        className="w-full md:w-auto px-6 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={!canSave || isSaving}
        className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        {isSaving ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Saving...</span>
          </>
        ) : (
          <span>Save Note</span>
        )}
      </button>
    </div>
  </div>
));

NoteEditorActions.displayName = 'NoteEditorActions';
