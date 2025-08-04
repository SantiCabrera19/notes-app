import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Tag, X, ChevronDown } from 'lucide-react';
import { AnimatedButton } from './ui/AnimatedButton';
import { SidebarSkeleton } from './ui/Skeleton';
import { DraggableNoteList } from './ui/DraggableNoteList';
import type { Note, Tag as TagType } from '../services/api';

interface SidebarProps {
  notes: Note[];
  selectedNoteId?: string;
  onNoteSelect: (noteId: string) => void;
  view: 'active' | 'archived' | 'all';
  searchQuery?: string;
  selectedTagIds?: string[];
  onSearch?: (query: string) => void;
  onTagFilter?: (tagIds: string[]) => void;
  availableTags?: TagType[];
  loading?: boolean;
  onNotesReorder?: (notes: Note[]) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  selectedNoteId,
  onNoteSelect,
  view,
  searchQuery = '',
  selectedTagIds = [],
  onSearch,
  onTagFilter,
  availableTags = [],
  loading = false,
  onNotesReorder,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showTagFilter, setShowTagFilter] = useState(false);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearchQuery);
  };

  const handleTagToggle = (tagId: string) => {
    const newSelectedTags = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    
    onTagFilter?.(newSelectedTags);
  };

  const clearFilters = () => {
    setLocalSearchQuery('');
    onSearch?.('');
    onTagFilter?.([]);
  };

  const filteredNotes = notes.filter(note => {
    if (localSearchQuery) {
      const query = localSearchQuery.toLowerCase();
      const matchesSearch = 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    if (selectedTagIds.length > 0) {
      const noteTagIds = note.tags.map(tag => tag.id);
      const hasSelectedTags = selectedTagIds.some(tagId => noteTagIds.includes(tagId));
      if (!hasSelectedTags) return false;
    }

    return true;
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
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <motion.input
              type="text"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <AnimatedButton
              onClick={() => onSearch?.(localSearchQuery)}
              size="sm"
              icon={<Search className="w-4 h-4" />}
            >
              Search
            </AnimatedButton>
          </form>
        </motion.div>

        {/* Tag Filter */}
        <motion.div className="relative">
          <AnimatedButton
            onClick={() => setShowTagFilter(!showTagFilter)}
            variant={selectedTagIds.length > 0 ? 'primary' : 'ghost'}
            size="sm"
            icon={<Tag className="w-4 h-4" />}
            iconPosition="right"
            className="w-full justify-between"
          >
            <span>Filter by tags</span>
            {selectedTagIds.length > 0 && (
              <motion.span 
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {selectedTagIds.length}
              </motion.span>
            )}
            <motion.div
              animate={{ rotate: showTagFilter ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </AnimatedButton>
          
          <AnimatePresence>
            {showTagFilter && (
              <motion.div 
                className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white">Filter by tags</h3>
                  {selectedTagIds.length > 0 && (
                    <AnimatedButton
                      onClick={clearFilters}
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                    >
                      Clear all
                    </AnimatedButton>
                  )}
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {availableTags.length === 0 ? (
                    <p className="text-xs text-gray-400">No tags available</p>
                  ) : (
                    availableTags.map(tag => (
                      <motion.label 
                        key={tag.id} 
                        className="flex items-center space-x-2 cursor-pointer"
                        whileHover={{ x: 2 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTagIds.includes(tag.id)}
                          onChange={() => handleTagToggle(tag.id)}
                          className="w-3 h-3 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-xs text-white">{tag.name}</span>
                      </motion.label>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Notes List */}
      <motion.div 
        className="flex-1 overflow-y-auto p-4"
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
                {localSearchQuery || selectedTagIds.length > 0 
                  ? 'No notes match your filters' 
                  : `No ${view} notes`
                }
              </p>
              {localSearchQuery && (
                <p className="text-gray-500 text-xs mt-1">
                  Search: "{localSearchQuery}"
                </p>
              )}
              {selectedTagIds.length > 0 && (
                <p className="text-gray-500 text-xs mt-1">
                  Filtered by tags
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