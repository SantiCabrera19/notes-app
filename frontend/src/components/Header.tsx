import { memo } from 'react';
import { motion } from 'framer-motion';
import { AnimatedButton } from './ui/AnimatedButton';
import { Plus, Archive, FileText, Grid3X3 } from 'lucide-react';
import { Auth } from './Auth';

interface HeaderProps {
  title: string;
  onViewChange?: (view: 'active' | 'archived' | 'all') => void;
  currentView?: 'active' | 'archived' | 'all';
  onCreateNote?: () => void;

  onGoHome?: () => void;
}

const viewConfig = {
  active: { icon: FileText, label: 'Active' },
  archived: { icon: Archive, label: 'Archived' },
  all: { icon: Grid3X3, label: 'All' },
};

export const Header = memo<HeaderProps>(({
  title,
  onViewChange,
  currentView = 'active',
  onCreateNote,
  onGoHome,
}) => {
  return (
    <motion.header 
      className="bg-gray-900 border-b border-gray-800 px-6 py-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between">
                            {/* Logo and Title */}
                    <motion.div
                      className="flex items-center space-x-3"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <motion.button
                        onClick={onGoHome}
                        className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                          whileHover={{ 
                            scale: 1.1, 
                            rotate: [0, -10, 10, -5, 0],
                            boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ 
                            type: 'spring', 
                            stiffness: 400,
                            damping: 10
                          }}
                        >
                          <img 
                            src="/n-logo.png" 
                            alt="Notes App Logo" 
                            className="w-8 h-8 object-contain filter brightness-0 invert"
                            onLoad={(e) => {
                              console.log('Logo loaded successfully');
                              // Remove the filter to show original colors
                              const target = e.target as HTMLImageElement;
                              target.className = "w-8 h-8 object-contain";
                            }}
                            onError={(e) => {
                              console.error('Logo failed to load, using fallback');
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = '<span class="text-white font-bold text-xl drop-shadow-lg">N</span>';
                            }}
                          />
                        </motion.div>
                        <motion.h1
                          className="text-xl font-semibold text-white"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {title}
                        </motion.h1>
                      </motion.button>
                    </motion.div>

        {/* View Toggles and New Note Button */}
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Auth Component */}
          <Auth />
          
          {/* View Toggles */}
          <motion.div
            className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {(['active', 'archived', 'all'] as const).map((view) => {
              const config = viewConfig[view];
              const Icon = config.icon;
              const isActive = currentView === view;

              return (
                <motion.button
                  key={view}
                  onClick={() => onViewChange?.(view)}
                  className={`px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{config.label}</span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* New Note Button */}
          <AnimatedButton
            onClick={onCreateNote}
            icon={<Plus className="w-4 h-4" />}
            size="md"
          >
            New Note
          </AnimatedButton>
        </motion.div>
      </div>
    </motion.header>
  );
}); 