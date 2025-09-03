import { } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { } from './ui/AnimatedButton';
import { SidebarSkeleton } from './ui/Skeleton';
import { DraggableNoteList } from './ui/DraggableNoteList';
import type { Note } from '../services/api';

interface SidebarProps {
  notes: Note[];
  selectedNoteId?: string;
  onNoteSelect: (noteId: string) => void;
  view: 'active' | 'archived' | 'all';
  searchQuery?: string;
  onSearch?: (query: string) => void;
  loading?: boolean;
  onNotesReorder?: (notes: Note[]) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  selectedNoteId,
  onNoteSelect,
  view,
  searchQuery = '',
  onSearch,
  loading = false,
  onNotesReorder,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`; 
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Normaliza texto: quita acentos, pasa a minúsculas y recorta
  const normalizeString = (value: string): string =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  // Real-time search - filter as user types
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onSearch?.(query); // Update parent state immediately
  };

  const clearFilters = () => {
    onSearch?.('');
  };

  // Prefijo por título: solo notas cuyo título comience con la query
  const filteredNotes = notes.filter(note => {
    const q = normalizeString(searchQuery || '');
    if (!q) return true;
    const title = normalizeString(note.title);
    return title.startsWith(q);
  });

  const renderNote = (note: Note, _index: number) => (
    <motion.div
      className={`p-4 rounded-lg border transition-all ${
        selectedNoteId === note.id
          ? 'bg-gray-800 border-blue-500 shadow-lg'
          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800'
      }`}
      whileHover={{ 
        boxShadow: selectedNoteId === note.id 
          ? '0 10px 25px rgba(59, 130, 246, 0.3)' 
          : '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Note Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-white text-sm line-clamp-2">
          {note.title}
        </h3>
        {note.isArchived && (
          <motion.span 
            className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full ml-2 flex-shrink-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            Archived
          </motion.span>
        )}
      </div>

      {/* Note Content Preview */}
      <p className="text-gray-400 text-xs mb-3 line-clamp-2">
        {truncateText(note.content, 80)}
      </p>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <motion.div 
          className="flex flex-wrap gap-1 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {note.tags.slice(0, 3).map(tag => (
            <motion.span
              key={tag.id}
              className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {tag.name}
            </motion.span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{note.tags.length - 3} more
            </span>
          )}
        </motion.div>
      )}

      {/* Note Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatDate(note.updatedAt)}</span>
        <div className="flex items-center space-x-1">
          <span>{note.content.length} chars</span>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <motion.div 
        className="h-full flex flex-col bg-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <SidebarSkeleton />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="h-full flex flex-col bg-gray-900"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Search and Filters */}
      <motion.div 
        className="p-4 border-b border-gray-800"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Search */}
        <motion.div className="mb-3">
          <div className="relative">
            <motion.input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search notes..."
              className="w-full px-3 py-2 pl-10 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            {searchQuery && (
              <button
                onClick={clearFilters}
                className="absolute inset-y-0 right-3 my-auto flex items-center text-gray-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>

      </motion.div>

      {/* Notes List */}
      <motion.div 
        className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {filteredNotes.length === 0 ? (
            <motion.div 
              key="empty"
              className="text-center py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div 
                className="w-12 h-12 mx-auto mb-4 text-gray-600"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Search className="w-full h-full" />
              </motion.div>
              <p className="text-gray-400 text-sm">
                {searchQuery 
                  ? 'No notes match your search' 
                  : `No ${view} notes`
                }
              </p>
              {searchQuery && (
                <p className="text-gray-500 text-xs mt-1">
                  Search: "{searchQuery}"
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="notes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DraggableNoteList
                notes={filteredNotes}
                selectedNoteId={selectedNoteId}
                onNoteSelect={onNoteSelect}
                onNotesReorder={onNotesReorder}
                renderNote={renderNote}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}; 