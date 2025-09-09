import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import type { Note } from '../../services/api';

interface DraggableNoteListProps {
  notes: Note[];
  selectedNoteId?: string;
  onNoteSelect: (noteId: string) => void;
  onNotesReorder?: (notes: Note[]) => void;
  renderNote: (note: Note, index: number) => React.ReactNode;
  disableReorder?: boolean;
}

export const DraggableNoteList: React.FC<DraggableNoteListProps> = ({
  notes,
  selectedNoteId: _selectedNoteId,
  onNoteSelect,
  onNotesReorder,
  renderNote,
  disableReorder = false,
}) => {
  const [items, setItems] = useState(notes);

  // Sync internal items when the incoming list changes (e.g., search filter)
  useEffect(() => {
    setItems(notes);
  }, [notes]);

  const handleReorder = (newOrder: Note[]) => {
    setItems(newOrder);
    onNotesReorder?.(newOrder);
  };

  if (disableReorder) {
    return (
      <div className="space-y-3">
        {items.map((note, index) => (
          <div key={note.id} className="relative">
            {/* Note Content (no drag handle) */}
            <div
              onClick={() => onNoteSelect(note.id)}
              className="cursor-pointer"
            >
              {renderNote(note, index)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={handleReorder}
      className="space-y-3"
    >
      {items.map((note, index) => (
        <Reorder.Item
          key={note.id}
          value={note}
          className="relative group"
          whileDrag={{ 
            scale: 1.02,
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            zIndex: 50
          }}
        >
          <div className="relative">
            {/* Drag Handle */}
            <motion.div
              className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10 p-1 rounded hover:bg-gray-700/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-200" />
            </motion.div>

            {/* Note Content */}
            <div
              onClick={() => onNoteSelect(note.id)}
              className="pl-8 cursor-pointer"
              onMouseDown={(e) => {
                // Prevent selection when clicking on the note content
                e.preventDefault();
              }}
            >
              {renderNote(note, index)}
            </div>
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};