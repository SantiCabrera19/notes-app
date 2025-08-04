import React from 'react';

interface HeaderProps {
  title: string;
  onViewChange?: (view: 'active' | 'archived' | 'all') => void;
  currentView?: 'active' | 'archived' | 'all';
  onCreateNote?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onViewChange,
  currentView = 'active',
  onCreateNote,
}) => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
        </div>

        {/* View Toggles and New Note Button */}
        <div className="flex items-center space-x-4">
          {/* View Toggles */}
          <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => onViewChange?.('active')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                currentView === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => onViewChange?.('archived')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                currentView === 'archived'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Archived
            </button>
            <button
              onClick={() => onViewChange?.('all')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                currentView === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
          </div>

          {/* New Note Button */}
          <button
            onClick={onCreateNote}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Note</span>
          </button>
        </div>
      </div>
    </header>
  );
}; 