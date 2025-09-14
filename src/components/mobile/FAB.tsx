import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FABProps {
  onClick?: () => void;
  label?: string;
}

export const FAB: React.FC<FABProps> = ({ onClick, label = 'New' }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-[88px] right-4 z-50 md:hidden w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors border border-blue-500"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Plus className="w-6 h-6" />
    </motion.button>
  );
};
