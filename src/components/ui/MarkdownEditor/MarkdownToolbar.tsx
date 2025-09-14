import { motion } from 'framer-motion';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Link, 
  Code,
  Quote,
  Eye,
  EyeOff
} from 'lucide-react';

interface MarkdownToolbarProps {
  onInsertMarkdown: (before: string, after?: string, placeholder?: string) => void;
  showPreview: boolean;
  onTogglePreview: () => void;
  isMobile: boolean;
  disabled?: boolean;
}

const ToolbarButton: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
  tooltip: string;
  disabled?: boolean;
}> = ({ icon, onClick, tooltip, disabled = false }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    className="p-1.5 md:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    whileTap={{ scale: disabled ? 1 : 0.95 }}
    title={tooltip}
  >
    {icon}
  </motion.button>
);

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({
  onInsertMarkdown,
  showPreview,
  onTogglePreview,
  isMobile,
  disabled = false,
}) => {
  const toolbarButtons = [
    { icon: <Bold size={16} />, action: () => onInsertMarkdown('**', '**', 'bold text'), tooltip: 'Bold' },
    { icon: <Italic size={16} />, action: () => onInsertMarkdown('*', '*', 'italic text'), tooltip: 'Italic' },
    { icon: <Heading1 size={16} />, action: () => onInsertMarkdown('# ', '', 'Heading 1'), tooltip: 'Heading 1' },
    { icon: <Heading2 size={16} />, action: () => onInsertMarkdown('## ', '', 'Heading 2'), tooltip: 'Heading 2' },
    { icon: <List size={16} />, action: () => onInsertMarkdown('- ', '', 'List item'), tooltip: 'Bullet List' },
    { icon: <ListOrdered size={16} />, action: () => onInsertMarkdown('1. ', '', 'List item'), tooltip: 'Numbered List' },
    { icon: <Link size={16} />, action: () => onInsertMarkdown('[', '](url)', 'link text'), tooltip: 'Link' },
    { icon: <Code size={16} />, action: () => onInsertMarkdown('`', '`', 'code'), tooltip: 'Inline Code' },
    { icon: <Quote size={16} />, action: () => onInsertMarkdown('> ', '', 'Quote'), tooltip: 'Quote' },
  ];

  // Show fewer tools on mobile
  const visibleButtons = isMobile ? toolbarButtons.slice(0, 6) : toolbarButtons;

  return (
    <div className="flex items-center justify-between p-2 md:p-3 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center space-x-1 md:space-x-2 overflow-x-auto">
        {visibleButtons.map((button, index) => (
          <ToolbarButton
            key={index}
            icon={button.icon}
            onClick={button.action}
            tooltip={button.tooltip}
            disabled={disabled}
          />
        ))}
      </div>
      
      <motion.button
        onClick={onTogglePreview}
        disabled={disabled}
        className="ml-2 p-1.5 md:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
      </motion.button>
    </div>
  );
};
