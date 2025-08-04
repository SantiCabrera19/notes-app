import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import type { Note } from '../../services/api';

interface DraggableNoteListProps {
  notes: Note[];
  selectedNoteId?: string;
  onNoteSelect: (noteId: string) => void;
  onNotesReorder?: (notes: Note[]) => void;
  renderNote: (note: Note, index: number) => React.ReactNode;
}

export const DraggableNoteList: React.FC<DraggableNoteListProps> = ({
  notes,
  selectedNoteId: _selectedNoteId,
  onNoteSelect,
  onNotesReorder,
  renderNote,
}) => {
  const [items, setItems] = useState(notes);

  const handleReorder = (newOrder: Note[]) => {
    setItems(newOrder);
    onNotesReorder?.(newOrder);
  };

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