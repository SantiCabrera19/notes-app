import React from 'react';
import { motion } from 'framer-motion';
import { Home, FileText, Tag } from 'lucide-react';

interface MobileNavProps {
  currentView?: 'active' | 'archived' | 'all';
  onViewChange?: (view: 'active' | 'archived' | 'all') => void;
  onGoHome?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView = 'active', onViewChange, onGoHome }) => {
  const items = [
    { key: 'home', label: 'Home', icon: Home, onClick: onGoHome },
    { key: 'active', label: 'Notes', icon: FileText, onClick: () => onViewChange?.('active') },
    { key: 'all', label: 'All', icon: FileText, onClick: () => onViewChange?.('all') },
    { key: 'tags', label: 'Tags', icon: Tag, onClick: () => onViewChange?.('active') },
  ];

  return (
    <motion.nav 
      className="fixed bottom-4 left-0 right-0 z-40 md:hidden"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{ paddingBottom: 'max( env(safe-area-inset-bottom), 8px )' }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mx-3 rounded-2xl border border-gray-800 bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 shadow-xl">
          <ul className="grid grid-cols-4 py-2">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === currentView || (item.key === 'home' && currentView === 'active');
              return (
                <li key={item.key}>
                  <button
                    onClick={item.onClick}
                    className={`w-full flex flex-col items-center gap-1 text-xs py-1 transition-colors ${
                      isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                    }`}
                    aria-label={item.label}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? '' : ''}`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};
