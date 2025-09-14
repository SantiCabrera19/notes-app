import { useState, useEffect, memo } from 'react';
import type { Note, CreateNoteRequest, UpdateNoteRequest, Tag } from '../services/api';
import { handleError } from '../utils/errorHandler';
import { NoteEditorHeader } from './NoteEditor/NoteEditorHeader';
import { NoteEditorForm } from './NoteEditor/NoteEditorForm';
import { NoteEditorActions } from './NoteEditor/NoteEditorActions';

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
    return title.trim() !== '' && content.trim() !== '';
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
      handleError(error, 'NoteEditor.handleSave');
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
        handleError(error, 'NoteEditor.handleDelete');
      }
    }
  };

  const handleToggleArchive = async () => {
    if (!note || !onToggleArchive) return;

    try {
      await onToggleArchive(note.id);
      onSaveSuccess?.();
    } catch (error) {
      handleError(error, 'NoteEditor.handleToggleArchive');
    }
  };

  const canSave = title.trim() !== '' && content.trim() !== '';

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <NoteEditorHeader
        isCreating={isCreating}
        note={note}
        onGoHome={onGoHome}
        onView={onView}
        onToggleArchive={handleToggleArchive}
        onDelete={handleDelete}
      />
      
      <NoteEditorForm
        title={title}
        content={content}
        selectedTags={selectedTags}
        availableTags={availableTags}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onTagsChange={setSelectedTags}
        onCreateTag={onCreateTag || (() => Promise.reject('No create tag handler'))}
        isSaving={isSaving}
        isCreating={isCreating}
      />
      
      <NoteEditorActions
        isSaving={isSaving}
        onSave={handleSave}
        onCancel={onCancel}
        canSave={canSave}
      />
    </div>
  );
});
