import { Note, CreateNoteRequest, UpdateNoteRequest } from '../models/Note';
export declare class NoteRepository {
    findAll(archived?: boolean): Promise<Note[]>;
    findById(id: string): Promise<Note | null>;
    create(data: CreateNoteRequest): Promise<Note>;
    update(id: string, data: UpdateNoteRequest): Promise<Note | null>;
    delete(id: string): Promise<boolean>;
    toggleArchive(id: string): Promise<Note | null>;
    findByTags(tagIds: string[], archived?: boolean): Promise<Note[]>;
    searchNotes(query: string, archived?: boolean): Promise<Note[]>;
}
