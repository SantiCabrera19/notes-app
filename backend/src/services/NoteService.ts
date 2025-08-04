import { NoteRepository } from '../repositories/NoteRepository';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../models/Note';

export class NoteService {
  private noteRepository: NoteRepository;

  constructor() {
    this.noteRepository = new NoteRepository();
  }

  async getAllNotes(): Promise<Note[]> {
    return await this.noteRepository.findAll();
  }

  async getActiveNotes(): Promise<Note[]> {
    return await this.noteRepository.findAll(false);
  }

  async getArchivedNotes(): Promise<Note[]> {
    return await this.noteRepository.findAll(true);
  }

  async getNoteById(id: string): Promise<Note | null> {
    if (!id) {
      throw new Error('Note ID is required');
    }
    return await this.noteRepository.findById(id);
  }

  async createNote(data: CreateNoteRequest): Promise<Note> {
    if (!data.title || !data.title.trim()) {
      throw new Error('Note title is required');
    }

    if (!data.content || !data.content.trim()) {
      throw new Error('Note content is required');
    }

    return await this.noteRepository.create(data);
  }

  async updateNote(id: string, data: UpdateNoteRequest): Promise<Note | null> {
    if (!id) {
      throw new Error('Note ID is required');
    }

    if (data.title !== undefined && !data.title.trim()) {
      throw new Error('Note title cannot be empty');
    }

    if (data.content !== undefined && !data.content.trim()) {
      throw new Error('Note content cannot be empty');
    }

    return await this.noteRepository.update(id, data);
  }

  async deleteNote(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Note ID is required');
    }

    return await this.noteRepository.delete(id);
  }

  async toggleArchiveNote(id: string): Promise<Note | null> {
    if (!id) {
      throw new Error('Note ID is required');
    }

    return await this.noteRepository.toggleArchive(id);
  }

  async getNotesByTags(tagIds: string[], archived?: boolean): Promise<Note[]> {
    if (!tagIds || tagIds.length === 0) {
      return archived ? await this.getArchivedNotes() : await this.getActiveNotes();
    }

    return await this.noteRepository.findByTags(tagIds, archived);
  }

  async searchNotes(query: string, archived?: boolean): Promise<Note[]> {
    if (!query || !query.trim()) {
      return archived ? await this.getArchivedNotes() : await this.getActiveNotes();
    }

    return await this.noteRepository.searchNotes(query.trim(), archived);
  }
} 