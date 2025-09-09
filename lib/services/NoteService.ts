import { NoteRepository } from '../repositories/NoteRepository';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../models/Note';

export class NoteService {
  private noteRepository: NoteRepository;

  constructor() {
    this.noteRepository = new NoteRepository();
  }

  async getAllNotes(userId: string): Promise<Note[]> {
    return await this.noteRepository.findAll(undefined, userId);
  }

  async getActiveNotes(userId: string): Promise<Note[]> {
    return await this.noteRepository.findAll(false, userId);
  }

  async getArchivedNotes(userId: string): Promise<Note[]> {
    return await this.noteRepository.findAll(true, userId);
  }

  async getNoteById(id: string, userId: string): Promise<Note | null> {
    if (!id) {
      throw new Error('Note ID is required');
    }
    return await this.noteRepository.findById(id, userId);
  }

  async createNote(data: CreateNoteRequest, userId: string): Promise<Note> {
    if (!data.title || !data.title.trim()) {
      throw new Error('Note title is required');
    }

    if (!data.content || !data.content.trim()) {
      throw new Error('Note content is required');
    }

    return await this.noteRepository.create(data, userId);
  }

  async updateNote(id: string, data: UpdateNoteRequest, userId: string): Promise<Note | null> {
    if (!id) {
      throw new Error('Note ID is required');
    }

    if (data.title !== undefined && !data.title.trim()) {
      throw new Error('Note title cannot be empty');
    }

    if (data.content !== undefined && !data.content.trim()) {
      throw new Error('Note content cannot be empty');
    }

    return await this.noteRepository.update(id, data, userId);
  }

  async deleteNote(id: string, userId: string): Promise<boolean> {
    if (!id) {
      throw new Error('Note ID is required');
    }

    return await this.noteRepository.delete(id, userId);
  }

  async toggleArchiveNote(id: string, userId: string): Promise<Note | null> {
    if (!id) {
      throw new Error('Note ID is required');
    }

    return await this.noteRepository.toggleArchive(id, userId);
  }

  async getNotesByTags(tagIds: string[], userId: string, archived?: boolean): Promise<Note[]> {
    if (!tagIds || tagIds.length === 0) {
      return archived ? await this.getArchivedNotes(userId) : await this.getActiveNotes(userId);
    }

    return await this.noteRepository.findByTags(tagIds, archived, userId);
  }

  async searchNotes(query: string, userId: string, archived?: boolean): Promise<Note[]> {
    if (!query || !query.trim()) {
      return archived ? await this.getArchivedNotes(userId) : await this.getActiveNotes(userId);
    }

    return await this.noteRepository.searchNotes(query.trim(), archived, userId);
  }
}
