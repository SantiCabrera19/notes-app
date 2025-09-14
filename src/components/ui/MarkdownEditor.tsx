import React, { useState } from 'react';
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
import { AnimatedButton } from './AnimatedButton';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const ToolbarButton: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
  tooltip: string;
}> = ({ icon, onClick, tooltip }) => (
  <motion.button
    onClick={onClick}
    className="p-1.5 md:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors flex-shrink-0"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    title={tooltip}
  >
    {icon}
  </motion.button>
);

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your note...",
  className = "",
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const insertMarkdown = (before: string, after: string = "", placeholder: string = "text") => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = selectedText || placeholder;

    const newValue = 
      value.substring(0, start) + 
      before + 
      replacement + 
      after + 
      value.substring(end);

    onChange(newValue);

    // Set cursor position
    setTimeout(() => {
      const newCursorPos = start + before.length + replacement.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const toolbarActions = [
    {
      icon: <Heading1 className="w-4 h-4" />,
      action: () => insertMarkdown("# ", "", "Heading 1"),
      tooltip: "Heading 1"
    },
    {
      icon: <Heading2 className="w-4 h-4" />,
      action: () => insertMarkdown("## ", "", "Heading 2"),
      tooltip: "Heading 2"
    },
    {
      icon: <Bold className="w-4 h-4" />,
      action: () => insertMarkdown("**", "**", "bold text"),
      tooltip: "Bold"
    },
    {
      icon: <Italic className="w-4 h-4" />,
      action: () => insertMarkdown("*", "*", "italic text"),
      tooltip: "Italic"
    },
    {
      icon: <Code className="w-4 h-4" />,
      action: () => insertMarkdown("`", "`", "code"),
      tooltip: "Inline Code"
    },
    {
      icon: <List className="w-4 h-4" />,
      action: () => insertMarkdown("- ", "", "list item"),
      tooltip: "Unordered List"
    },
    {
      icon: <ListOrdered className="w-4 h-4" />,
      action: () => insertMarkdown("1. ", "", "list item"),
      tooltip: "Ordered List"
    },
    {
      icon: <Quote className="w-4 h-4" />,
      action: () => insertMarkdown("> ", "", "quote"),
      tooltip: "Quote"
    },
    {
      icon: <Link className="w-4 h-4" />,
      action: () => insertMarkdown("[", "](url)", "link text"),
      tooltip: "Link"
    }
  ];

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Toolbar */}
      <motion.div 
        className="flex items-center justify-between p-2 md:p-3 bg-gray-800 border-b border-gray-700 rounded-t-lg"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center space-x-1 overflow-x-auto">
          {/* Mobile: Show only essential tools */}
          {(isMobile ? toolbarActions.slice(0, 4) : toolbarActions).map((action, index) => (
            <ToolbarButton
              key={index}
              icon={action.icon}
              onClick={action.action}
              tooltip={action.tooltip}
            />
          ))}
        </div>
        
        <AnimatedButton
          onClick={() => setShowPreview(!showPreview)}
          variant={showPreview ? "primary" : "ghost"}
          size="sm"
          icon={showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">{showPreview ? 'Edit' : 'Preview'}</span>
        </AnimatedButton>
      </motion.div>

      {/* Editor/Preview Area */}
      <div className="flex-1 flex">
        {/* Split view on desktop, toggle on mobile */}
        {!isMobile && !showPreview && (
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-full p-4 bg-gray-900 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-0 border-0"
              style={{ fontFamily: 'monospace' }}
            />
          </motion.div>
        )}

        {/* Mobile: Editor */}
        {isMobile && !showPreview && (
          <motion.div 
            className="flex-1 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="flex-1 p-4 bg-gray-900 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-0 border-0 text-base leading-relaxed min-h-[60vh]"
              style={{ fontFamily: 'system-ui', lineHeight: '1.6' }}
            />
            {/* Live character count with better styling */}
            <div className="px-4 py-3 bg-gray-800 text-sm text-gray-400 border-t border-gray-700 flex justify-between items-center">
              <span>{value.length} characters</span>
              <span className="text-blue-400 text-xs">Scroll for more space</span>
            </div>
          </motion.div>
        )}
        
        {/* Desktop: Split view when preview is on */}
        {!isMobile && showPreview && (
          <>
            <motion.div 
              className="flex-1 border-r border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-full p-4 bg-gray-900 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-0 border-0"
                style={{ fontFamily: 'monospace' }}
              />
            </motion.div>
            <motion.div 
              className="flex-1 p-4 bg-gray-850 overflow-y-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <MarkdownPreview content={value} />
            </motion.div>
          </>
        )}

        {/* Mobile: Preview only */}
        {isMobile && showPreview && (
          <motion.div 
            className="flex-1 p-4 bg-gray-850 overflow-y-auto min-h-[60vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MarkdownPreview content={value} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Markdown Preview Component
const MarkdownPreview: React.FC<{ content: string }> = ({ content }) => {
  if (!content.trim()) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-32 text-gray-400 italic"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Eye className="w-8 h-8 mb-2 text-gray-500" />
        <p>Start writing to see the preview...</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="prose prose-invert prose-sm max-w-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <MarkdownRenderer content={content} />
    </motion.div>
  );
};

// Simple Markdown Renderer (we'll replace this with react-markdown)
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const renderMarkdown = (text: string) => {
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-white mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
      // Inline code
      .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // Lists
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 text-gray-300">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 text-gray-300">$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-3 text-gray-300">')
      .replace(/^(?!<[h|li|p])(.*$)/gim, '<p class="mb-3 text-gray-300">$1</p>');
  };

  return (
    <div 
      className="text-gray-300"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}; 