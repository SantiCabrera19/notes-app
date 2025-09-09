import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Edit, 
  Archive, 
  Trash2, 
  ArrowLeft, 
  Calendar, 
  Tag, 
  FileText,
  Clock
} from 'lucide-react';
import { AnimatedButton } from './ui/AnimatedButton';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { MarkdownRenderer } from './ui/MarkdownRenderer';
import type { Note, Tag as TagType } from '../services/api';

interface NoteViewerProps {
  note: Note;
  availableTags: TagType[];
  onEdit: () => void;
  onBack: () => void;
  onDelete: (id: string) => void;
  onToggleArchive: (id: string) => void;
}

export const NoteViewer = memo<NoteViewerProps>(({
  note,
  onEdit,
  onBack,
  onDelete,
  onToggleArchive,
  availableTags: _availableTags,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Justo ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)} días`;
  };

  return (
    <>
      {/* Backdrop only on mobile when sheet is open */}
      <div className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" />

      <motion.div 
        className="h-full md:static md:relative fixed inset-0 z-40 flex flex-col bg-gray-900 md:bg-gray-900/50 backdrop-blur-sm"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <motion.div 
          className="p-6 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AnimatedButton
                onClick={onBack}
                variant="ghost"
                size="sm"
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </AnimatedButton>
              <div>
                <h1 className="text-2xl font-bold text-white">{note.title}</h1>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(note.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{getTimeAgo(note.updatedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>{note.content.length} caracteres</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <AnimatedButton
                onClick={onEdit}
                variant="primary"
                size="sm"
                icon={<Edit className="w-4 h-4" />}
              >
                Edit
              </AnimatedButton>
              <AnimatedButton
                onClick={() => onToggleArchive(note.id)}
                variant="ghost"
                size="sm"
                icon={<Archive className="w-4 h-4" />}
              >
                {note.isArchived ? 'Unarchive' : 'Archive'}
              </AnimatedButton>
              <AnimatedButton
                onClick={() => setShowDeleteConfirm(true)}
                variant="ghost"
                size="sm"
                icon={<Trash2 className="w-4 h-4" />}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                Delete
              </AnimatedButton>
            </div>
          </div>
        </motion.div>

        {/* Tags Section */}
        {note.tags && note.tags.length > 0 && (
          <motion.div 
            className="px-6 py-4 border-b border-gray-800 bg-gray-900/60"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {note.tags.map(tag => (
                  <motion.span
                    key={tag.id}
                    className="px-3 py-1 text-xs bg-blue-900/50 text-blue-300 rounded-full border border-blue-700/50"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {tag.name}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Content */}
        <motion.div 
          className="flex-1 p-6 overflow-y-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-invert prose-lg max-w-none">
              <MarkdownRenderer content={note.content} />
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="p-4 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <span>ID: {note.id}</span>
              <span>Status: {note.isArchived ? 'Archived' : 'Active'}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Created: {formatDate(note.createdAt)}</span>
              <span>Updated: {formatDate(note.updatedAt)}</span>
            </div>
          </div>
        </motion.div>

        {/* Delete confirm dialog */}
        <ConfirmDialog
          title="¿Eliminar esta nota?"
          description="Esta acción no se puede deshacer. Para confirmar, escribe el título exacto de la nota."
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          danger
          requireTextMatch={note.title}
          isOpen={showDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            onDelete(note.id);
          }}
        />
      </motion.div>
    </>
  );
});