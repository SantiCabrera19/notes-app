import { useState, useEffect } from 'react';
import { shouldReduceAnimations } from '../utils/mobileOptimizations';

export const useOptimizedAnimations = () => {
  const [reduceAnimations, setReduceAnimations] = useState(false);

  useEffect(() => {
    const checkAnimationPreference = () => {
      setReduceAnimations(shouldReduceAnimations());
    };

    checkAnimationPreference();

    // Listen for changes in motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkAnimationPreference);

    return () => {
      mediaQuery.removeEventListener('change', checkAnimationPreference);
    };
  }, []);

  return {
    reduceAnimations,
    // Optimized animation variants
    fadeIn: reduceAnimations 
      ? { opacity: 1 }
      : { 
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        },
    slideIn: reduceAnimations
      ? { x: 0, opacity: 1 }
      : {
          initial: { x: 20, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -20, opacity: 0 }
        },
    scaleIn: reduceAnimations
      ? { scale: 1 }
      : {
          initial: { scale: 0.95, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.95, opacity: 0 }
        }
  };
};
