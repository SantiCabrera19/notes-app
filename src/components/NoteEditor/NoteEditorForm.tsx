import { memo } from 'react';
import { MarkdownEditor } from '../ui/MarkdownEditor';
import { TagSelector } from '../TagSelector';
import type { Tag } from '../../services/api';

interface NoteEditorFormProps {
  title: string;
  content: string;
  selectedTags: Tag[];
  availableTags: Tag[];
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onTagsChange: (tags: Tag[]) => void;
  onCreateTag: (name: string) => Promise<Tag>;
  isSaving: boolean;
  isCreating: boolean;
}

export const NoteEditorForm = memo<NoteEditorFormProps>(({
  title,
  content,
  selectedTags,
  availableTags,
  onTitleChange,
  onContentChange,
  onTagsChange,
  onCreateTag,
  isSaving,
  isCreating,
}) => (
  <div className="flex-1 flex flex-col overflow-hidden">
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Title Input */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter note title..."
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          disabled={isSaving}
        />
      </div>

      {/* Tags Selector */}
      <div className="block">
        <TagSelector
          selectedTags={selectedTags}
          availableTags={availableTags}
          onTagsChange={onTagsChange}
          onCreateTag={onCreateTag}
          disabled={isSaving}
        />
      </div>
    </div>

    {/* Content Editor */}
    <div className="flex-1 flex flex-col min-h-0">
      <MarkdownEditor
        value={content}
        onChange={onContentChange}
        placeholder={isCreating ? "Start writing your note..." : "Edit your note..."}
        disabled={isSaving}
        className="flex-1"
      />
    </div>
  </div>
));

NoteEditorForm.displayName = 'NoteEditorForm';
