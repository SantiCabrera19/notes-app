"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteService = void 0;
const NoteRepository_1 = require("../repositories/NoteRepository");
class NoteService {
    constructor() {
        this.noteRepository = new NoteRepository_1.NoteRepository();
    }
    async getAllNotes() {
        return await this.noteRepository.findAll();
    }
    async getActiveNotes() {
        return await this.noteRepository.findAll(false);
    }
    async getArchivedNotes() {
        return await this.noteRepository.findAll(true);
    }
    async getNoteById(id) {
        if (!id) {
            throw new Error('Note ID is required');
        }
        return await this.noteRepository.findById(id);
    }
    async createNote(data) {
        if (!data.title || !data.title.trim()) {
            throw new Error('Note title is required');
        }
        if (!data.content || !data.content.trim()) {
            throw new Error('Note content is required');
        }
        return await this.noteRepository.create(data);
    }
    async updateNote(id, data) {
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
    async deleteNote(id) {
        if (!id) {
            throw new Error('Note ID is required');
        }
        return await this.noteRepository.delete(id);
    }
    async toggleArchiveNote(id) {
        if (!id) {
            throw new Error('Note ID is required');
        }
        return await this.noteRepository.toggleArchive(id);
    }
    async getNotesByTags(tagIds, archived) {
        if (!tagIds || tagIds.length === 0) {
            return archived ? await this.getArchivedNotes() : await this.getActiveNotes();
        }
        return await this.noteRepository.findByTags(tagIds, archived);
    }
    async searchNotes(query, archived) {
        if (!query || !query.trim()) {
            return archived ? await this.getArchivedNotes() : await this.getActiveNotes();
        }
        return await this.noteRepository.searchNotes(query.trim(), archived);
    }
}
exports.NoteService = NoteService;
//# sourceMappingURL=NoteService.js.map