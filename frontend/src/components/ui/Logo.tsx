import { useState, useEffect } from 'react';
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

  // Prefer transparent asset if available
  const [currentSrc, setCurrentSrc] = useState('/n-logo-transparent.png');

  const handleImageLoad = () => {
    setImageError(false);
  };

  const handleImageError = () => {
    console.warn(`Failed to load logo from: ${currentSrc}`);
    // Fallback to non-transparent asset once
    if (currentSrc !== '/n-logo.png') {
      setCurrentSrc('/n-logo.png');
      return;
    }
    setImageError(true);
  };

  // Initial reset
  useEffect(() => {
    setImageError(false);
  }, []);

  const containerSize = sizeClasses[size];

  if (imageError && !showFallback) {
    return null;
  }

  return (
    <div className={`${containerSize} relative flex items-center justify-center ${className}`}>
      {/* Always render the image; hide only if it errors */}
      <img
        src={currentSrc}
        alt="Notes App Logo"
        className={`${containerSize} object-contain select-none pointer-events-none ${imageError ? 'hidden' : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {imageError && showFallback && (
        <motion.div
          className={`${containerSize} bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-white font-bold text-lg drop-shadow-lg">
            N
          </span>
        </motion.div>
      )}
    </div>
  );
};
