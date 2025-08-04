
import { motion } from 'framer-motion';
import { AnimatedButton } from './ui/AnimatedButton';
import { Plus, Archive, FileText, Grid3X3 } from 'lucide-react';

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

export const Header: React.FC<HeaderProps> = ({
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
                          className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <span className="text-white font-bold text-sm">N</span>
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
}; 