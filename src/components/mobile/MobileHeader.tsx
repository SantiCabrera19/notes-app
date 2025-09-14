import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../ui/Logo';
import { AnimatedButton } from '../ui/AnimatedButton';
import { Plus, Search as SearchIcon, FileText, Archive, Grid3X3, Menu } from 'lucide-react';
import { Auth } from '../Auth';

interface MobileHeaderProps {
  currentView: 'active' | 'archived' | 'all';
  onViewChange: (view: 'active' | 'archived' | 'all') => void;
  onCreateNote?: () => void;
  onSearch?: (query: string) => void;
  onGoHome?: () => void;
  onOpenMenu?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  currentView,
  onViewChange,
  onCreateNote,
  onSearch,
  onGoHome,
  onOpenMenu,
}) => {
  const [query, setQuery] = useState('');

  const chips: Array<{ key: 'active'|'archived'|'all'; label: string; icon: any }> = [
    { key: 'active', label: 'Active', icon: FileText },
    { key: 'archived', label: 'Archived', icon: Archive },
    { key: 'all', label: 'All', icon: Grid3X3 },
  ];

  return (
    <div className="bg-gray-900/90 backdrop-blur border-b border-gray-800">
      {/* Top row: Logo, Auth, Menu */}
      <div className="px-4 py-3 flex items-center justify-between">
        <button onClick={onGoHome} className="flex items-center gap-2">
          <Logo className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <Auth />
          </div>
          <button
            className="p-2 rounded-md bg-gray-800 text-gray-300"
            aria-label="Menu"
            onClick={onOpenMenu}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
            placeholder="Search notes..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* View chips */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          {chips.map(({ key, label, icon: Icon }) => (
            <motion.button
              key={key}
              onClick={() => onViewChange(key)}
              className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1 border ${
                currentView === key
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-gray-800 text-gray-300 border-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </motion.button>
          ))}

          <AnimatedButton
            onClick={onCreateNote}
            size="sm"
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            className="ml-auto"
          >
            New
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};
