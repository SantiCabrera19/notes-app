import { motion } from 'framer-motion';
import { LazyMarkdownRenderer } from '../LazyMarkdownRenderer';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ 
  content, 
  className = "" 
}) => (
  <motion.div 
    className={`p-4 bg-gray-850 overflow-y-auto ${className}`}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
  >
    <LazyMarkdownRenderer content={content} />
  </motion.div>
);
