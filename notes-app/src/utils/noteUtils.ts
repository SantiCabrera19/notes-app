import type { Note } from '../services/api';

export const getCurrentNotes = (
  currentView: 'active' | 'archived' | 'all',
  activeNotes: Note[],
  archivedNotes: Note[],
  allNotes: Note[]
): Note[] => {
  switch (currentView) {
    case 'active':
      return activeNotes;
    case 'archived':
      return archivedNotes;
    case 'all':
      return allNotes;
    default:
      return activeNotes;
  }
};

export const findSelectedNote = (
  selectedNoteId: string | undefined,
  notes: Note[],
  activeNotes: Note[],
  archivedNotes: Note[]
): Note | undefined => {
  if (!selectedNoteId) return undefined;
  
  return (
    notes.find(note => note.id === selectedNoteId) ||
    activeNotes.find(note => note.id === selectedNoteId) ||
    archivedNotes.find(note => note.id === selectedNoteId)
  );
};

export const getAllNotes = (activeNotes: Note[], archivedNotes: Note[]): Note[] => {
  return [...activeNotes, ...archivedNotes];
};

export const getNotesCreatedToday = (notes: Note[]): Note[] => {
  const today = new Date().toDateString();
  return notes.filter(note => {
    const noteDate = new Date(note.createdAt).toDateString();
    return noteDate === today;
  });
};

export const getNotesWithTags = (notes: Note[]): Note[] => {
  return notes.filter(note => note.tags && note.tags.length > 0);
};

export const getRecentNotes = (notes: Note[], limit: number = 5): Note[] => {
  return notes
    .filter(note => !note.isArchived)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
};

export const getTagUsage = (tags: any[], notes: Note[]) => {
  return tags.map(tag => {
    const usage = notes.filter(note => 
      note.tags?.some(noteTag => noteTag.id === tag.id)
    ).length;
    return { ...tag, usage };
  }).sort((a, b) => b.usage - a.usage);
}; 