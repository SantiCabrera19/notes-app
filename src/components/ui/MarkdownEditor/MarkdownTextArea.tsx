import { motion } from 'framer-motion';
import { useOptimizedAnimations } from '../../../hooks/useOptimizedAnimations';

interface MarkdownTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
  height?: string;
}

export const MarkdownTextArea: React.FC<MarkdownTextAreaProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  className = "",
  height = "h-96 md:h-80"
}) => {
  const { fadeIn } = useOptimizedAnimations();
  
  return (
    <motion.div 
      className={`flex-1 ${className}`}
      {...fadeIn}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full ${height} p-4 bg-gray-900 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-0 border-0 disabled:opacity-50 disabled:cursor-not-allowed`}
        style={{ fontFamily: 'monospace' }}
      />
    </motion.div>
  );
};
