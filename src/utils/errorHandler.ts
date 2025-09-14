// Centralized error handling utility
export const handleError = (error: unknown, context: string): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error in ${context}:`, error);
  }
  // In production, could send to error tracking service
};

export const logInfo = (message: string, data?: any): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, data);
  }
};
