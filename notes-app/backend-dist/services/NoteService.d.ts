import { Note, CreateNoteRequest, UpdateNoteRequest } from '../models/Note';
export declare class NoteService {
    private noteRepository;
    constructor();
    getAllNotes(): Promise<Note[]>;
    getActiveNotes(): Promise<Note[]>;
    getArchivedNotes(): Promise<Note[]>;
    getNoteById(id: string): Promise<Note | null>;
    createNote(data: CreateNoteRequest): Promise<Note>;
    updateNote(id: string, data: UpdateNoteRequest): Promise<Note | null>;
    deleteNote(id: string): Promise<boolean>;
    toggleArchiveNote(id: string): Promise<Note | null>;
    getNotesByTags(tagIds: string[], archived?: boolean): Promise<Note[]>;
    searchNotes(query: string, archived?: boolean): Promise<Note[]>;
}
