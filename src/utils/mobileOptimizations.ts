// Mobile performance optimizations
export const isMobile = () => window.innerWidth < 768;

export const isLowEndDevice = () => {
  // Check for low-end device indicators
  const connection = (navigator as any).connection;
  const memory = (navigator as any).deviceMemory;
  
  return (
    memory && memory < 4 || // Less than 4GB RAM
    connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') ||
    navigator.hardwareConcurrency < 4 // Less than 4 CPU cores
  );
};

export const shouldReduceAnimations = () => {
  // Respect user's motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return prefersReducedMotion || isLowEndDevice();
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
