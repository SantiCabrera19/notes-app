import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showFallback?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-10 h-10'
};

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showFallback = true,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  // Initial reset
  useEffect(() => {
    setImageError(false);
  }, []);

  const containerSize = sizeClasses[size];

  // We now render an inline SVG by default. If showFallback=false and we somehow
  // mark imageError, return null; otherwise show the SVG.
  if (imageError && !showFallback) return null;

  return (
    <div className={`${containerSize} relative flex items-center justify-center ${className}`}>
      {/* Inline SVG logo ensures it always renders in production */}
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 64 64"
        className="select-none pointer-events-none"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6"/>
            <stop offset="100%" stopColor="#a855f7"/>
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="12" fill="url(#g)" />
        <path
          d="M20 44 V20 h6 l12 16 V20 h6 v24 h-6 L26 28 v16z"
          fill="#fff"
          fillOpacity="0.95"
        />
      </motion.svg>
    </div>
  );
};
