import React, { useState } from 'react';
import type { Note, Tag } from '../services/api';

interface SidebarProps {
  notes: Note[];
  selectedNoteId?: string;
  onNoteSelect: (noteId: string) => void;
  view: 'active' | 'archived' | 'all';
  searchQuery?: string;
  selectedTagIds?: string[];
  onSearch?: (query: string) => void;
  onTagFilter?: (tagIds: string[]) => void;
  availableTags?: Tag[];
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
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showSearch, setShowSearch] = useState(false);
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
    // Filter by search query
    if (localSearchQuery) {
      const query = localSearchQuery.toLowerCase();
      const matchesSearch = 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Filter by selected tags
    if (selectedTagIds.length > 0) {
      const noteTagIds = note.tags.map(tag => tag.id);
      const hasSelectedTags = selectedTagIds.some(tagId => noteTagIds.includes(tagId));
      if (!hasSelectedTags) return false;
    }

    return true;
  });

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-800">
        {/* Search */}
        <div className="mb-3">
          <div className="relative">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Tag Filter */}
        <div className="relative">
          <button
            onClick={() => setShowTagFilter(!showTagFilter)}
            className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors flex items-center justify-between ${
              selectedTagIds.length > 0 
                ? 'text-blue-400 bg-blue-900/20 border border-blue-700' 
                : 'text-gray-400 hover:text-white bg-gray-800 border border-gray-700'
            }`}
          >
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>Filter by tags</span>
              {selectedTagIds.length > 0 && (
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                  {selectedTagIds.length}
                </span>
              )}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${showTagFilter ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showTagFilter && (
            <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-white">Filter by tags</h3>
                {selectedTagIds.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {availableTags.length === 0 ? (
                  <p className="text-xs text-gray-400">No tags available</p>
                ) : (
                  availableTags.map(tag => (
                    <label key={tag.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTagIds.includes(tag.id)}
                        onChange={() => handleTagToggle(tag.id)}
                        className="w-3 h-3 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-xs text-white">{tag.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 text-gray-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
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
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => onNoteSelect(note.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-gray-800 ${
                  selectedNoteId === note.id
                    ? 'bg-gray-800 border-blue-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                {/* Note Header */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-white text-sm line-clamp-2">
                    {note.title}
                  </h3>
                  {note.isArchived && (
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                      Archived
                    </span>
                  )}
                </div>

                {/* Note Content Preview */}
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                  {truncateText(note.content, 80)}
                </p>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {note.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag.id}
                        className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{note.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Note Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(note.updatedAt)}</span>
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{note.content.length} chars</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 