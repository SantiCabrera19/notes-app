import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = '100%',
  height = '20px',
  rounded = 'md',
}) => {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <motion.div
      className={`bg-gray-700 ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// Skeleton components for common use cases
export const NoteSkeleton: React.FC = () => (
  <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50 space-y-3">
    <Skeleton height="20px" width="70%" />
    <Skeleton height="16px" width="100%" />
    <Skeleton height="16px" width="90%" />
    <div className="flex items-center justify-between pt-2">
      <Skeleton height="12px" width="60px" />
      <Skeleton height="12px" width="80px" />
    </div>
  </div>
);

export const SidebarSkeleton: React.FC = () => (
  <div className="h-full flex flex-col bg-gray-900">
    {/* Search and Filters Section */}
    <div className="p-4 border-b border-gray-800 space-y-3">
      <div className="flex items-center space-x-2">
        <Skeleton height="36px" width="calc(100% - 80px)" />
        <Skeleton height="36px" width="80px" />
      </div>
      <Skeleton height="36px" width="100%" />
    </div>
    
    {/* Notes List Section */}
    <div className="flex-1 p-4 space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="p-4 rounded-lg border border-gray-700 bg-gray-800/50 space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-start justify-between">
            <Skeleton height="16px" width="70%" />
            <Skeleton height="20px" width="60px" />
          </div>
          <Skeleton height="14px" width="100%" />
          <Skeleton height="14px" width="85%" />
          <div className="flex items-center space-x-2">
            <Skeleton height="20px" width="50px" rounded="full" />
            <Skeleton height="20px" width="40px" rounded="full" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <Skeleton height="12px" width="60px" />
            <Skeleton height="12px" width="80px" />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export const EditorSkeleton: React.FC = () => (
  <div className="p-6 space-y-4">
    <Skeleton height="40px" width="100%" />
    <Skeleton height="32px" width="60%" />
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} height="16px" width={`${Math.random() * 40 + 60}%`} />
      ))}
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="p-6 space-y-6">
    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-2"
    >
      <Skeleton height="36px" width="200px" />
      <Skeleton height="20px" width="300px" />
    </motion.div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton height="16px" width="120px" />
              <Skeleton height="32px" width="60px" />
              <Skeleton height="12px" width="100px" />
            </div>
            <Skeleton height="48px" width="48px" rounded="lg" />
          </div>
        </motion.div>
      ))}
    </div>

    {/* Recent Notes and Popular Tags */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Notes */}
      <motion.div
        className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Skeleton height="20px" width="20px" />
          <Skeleton height="20px" width="120px" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="space-y-1">
                <Skeleton height="14px" width="150px" />
                <Skeleton height="12px" width="200px" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton height="20px" width="40px" rounded="full" />
                <Skeleton height="12px" width="60px" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Popular Tags */}
      <motion.div
        className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Skeleton height="20px" width="20px" />
          <Skeleton height="20px" width="120px" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <Skeleton height="14px" width="100px" />
              <Skeleton height="20px" width="50px" rounded="full" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
); 