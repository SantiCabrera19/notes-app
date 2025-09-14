import { useState, useEffect, memo } from 'react';
import { TagSelector } from './TagSelector';
import { MarkdownEditor } from './ui/MarkdownEditor';
import type { Note, CreateNoteRequest, UpdateNoteRequest, Tag } from '../services/api';

interface NoteEditorProps {
  note?: Note;
  isCreating: boolean;
  onSave: (data: CreateNoteRequest | UpdateNoteRequest) => Promise<void>;
  onCancel: () => void;
  onDelete?: (id: string) => Promise<void>;
  onToggleArchive?: (id: string) => Promise<void>;
  availableTags: Tag[];
  onCreateTag?: (name: string) => Promise<Tag>;
  onSaveSuccess?: () => void;
  onGoHome?: () => void;
  onView?: () => void;
}

export const NoteEditor = memo<NoteEditorProps>(({
  note,
  isCreating,
  onSave,
  onCancel,
  onDelete,
  onToggleArchive,
  availableTags,
  onCreateTag,
  onSaveSuccess,
  onGoHome,
  onView,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  // Cargar datos de la nota si estamos editando
  useEffect(() => {
    if (note && !isCreating) {
      setTitle(note.title);
      setContent(note.content);
      setSelectedTags(note.tags || []);
    } else {
      setTitle('');
      setContent('');
      setSelectedTags([]);
    }
    setErrors({});
  }, [note, isCreating]);

  // Atajos de teclado - Solo desktop
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S para guardar
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Esc para cancelar
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [title, content, selectedTags]);

  const validateForm = () => {
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const data = {
        title: title.trim(),
        content: content.trim(),
        tagIds: selectedTags.map(tag => tag.id),
      };

      if (isCreating) {
        await onSave(data);
        // After creating, redirect to list
        onSaveSuccess?.();
      } else if (note) {
        await onSave(data);
        // After updating, redirect to list
        onSaveSuccess?.();
      }
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!note || !onDelete) return;

    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await onDelete(note.id);
        onSaveSuccess?.();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleToggleArchive = async () => {
    if (!note || !onToggleArchive) return;

    try {
      await onToggleArchive(note.id);
      onSaveSuccess?.();
    } catch (error) {
      console.error('Error toggling archive:', error);
    }
  };

  return (
    <>
      {/* Mobile backdrop for sheet */}
      <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      <div className="h-full md:static md:relative fixed inset-0 z-[60] flex flex-col bg-gray-900 md:bg-transparent">
      {/* Header */}
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
                onClick={handleToggleArchive}
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
                onClick={handleDelete}
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

      {/* Form */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Title Input */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.title ? 'border-red-500' : 'border-gray-700'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Tags Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <TagSelector
              selectedTags={selectedTags}
              availableTags={availableTags}
              onTagsChange={setSelectedTags}
              onCreateTag={onCreateTag}
              disabled={isSaving}
            />
          </div>

          {/* Content Editor */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
              Content
            </label>
            <div className={`border rounded-lg overflow-hidden ${
              errors.content ? 'border-red-500' : 'border-gray-700'
            }`}>
              <MarkdownEditor
                value={content}
                onChange={setContent}
                placeholder="Write your note content here... Use Markdown for formatting!"
                className="h-[300px] md:h-[500px]"
              />
            </div>
            {errors.content && (
              <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.content}</span>
              </p>
            )}
            <div className="mt-2 text-xs text-gray-500">
              {content.length} characters <span className="hidden md:inline">• Use toolbar for formatting</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-6 border-t border-gray-800">
            <button
              onClick={onCancel}
              className="px-6 py-3 md:py-2 text-gray-400 hover:text-white transition-colors flex items-center justify-center space-x-2 border border-gray-600 rounded-lg md:border-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 md:flex-none px-6 py-3 md:py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
});
