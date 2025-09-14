import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

// Lazy load the MarkdownRenderer for better performance
const MarkdownRenderer = lazy(() => 
  import('./MarkdownRenderer').then(module => ({ default: module.MarkdownRenderer }))
);

interface LazyMarkdownRendererProps {
  content: string;
  className?: string;
}

export const LazyMarkdownRenderer: React.FC<LazyMarkdownRendererProps> = ({ 
  content, 
  className = "" 
}) => (
  <Suspense fallback={<LoadingSpinner />}>
    <MarkdownRenderer content={content} className={className} />
  </Suspense>
);
