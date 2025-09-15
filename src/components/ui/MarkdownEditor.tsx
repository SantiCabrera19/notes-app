import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MarkdownToolbar } from './MarkdownEditor/MarkdownToolbar';
import { MarkdownPreview } from './MarkdownEditor/MarkdownPreview';
import { MarkdownTextArea } from './MarkdownEditor/MarkdownTextArea';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}


export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your note...",
  className = "",
  disabled = false,
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
    if (!textarea || disabled) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = selectedText || placeholder;

    const newValue = value.substring(0, start) + before + replacement + after + value.substring(end);
    onChange(newValue);

    // Set cursor position
    setTimeout(() => {
      const newCursorPos = start + before.length + replacement.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };


  return (
    <div className={`flex flex-col h-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      <MarkdownToolbar
        onInsertMarkdown={insertMarkdown}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
        isMobile={isMobile}
        disabled={disabled}
      />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Desktop: Editor only when preview is off */}
        {!isMobile && !showPreview && (
          <MarkdownTextArea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
          />
        )}

        {/* Mobile: Editor */}
        {isMobile && !showPreview && (
          <motion.div 
            className="flex-1 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MarkdownTextArea
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              className="flex-1"
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
            <MarkdownTextArea
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              height="h-full"
              className="flex-1 border-r border-gray-700"
            />
            <MarkdownPreview content={value} />
          </>
        )}
        
        {/* Mobile: Preview */}
        {isMobile && showPreview && (
          <MarkdownPreview content={value} />
        )}
      </div>
    </div>
  );
};
