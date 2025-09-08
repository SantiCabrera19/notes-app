"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteController = void 0;
const NoteService_1 = require("../services/NoteService");
class NoteController {
    constructor() {
        this.noteService = new NoteService_1.NoteService();
    }
    async getAllNotes(req, res) {
        try {
            const notes = await this.noteService.getAllNotes();
            res.json(notes);
        }
        catch (error) {
            console.error('Error getting all notes:', error);
            res.status(500).json({ error: 'Failed to get notes' });
        }
    }
    async getActiveNotes(req, res) {
        try {
            const notes = await this.noteService.getActiveNotes();
            res.json(notes);
        }
        catch (error) {
            console.error('Error getting active notes:', error);
            res.status(500).json({ error: 'Failed to get active notes' });
        }
    }
    async getArchivedNotes(req, res) {
        try {
            const notes = await this.noteService.getArchivedNotes();
            res.json(notes);
        }
        catch (error) {
            console.error('Error getting archived notes:', error);
            res.status(500).json({ error: 'Failed to get archived notes' });
        }
    }
    async getNoteById(req, res) {
        try {
            const { id } = req.params;
            const note = await this.noteService.getNoteById(id);
            if (!note) {
                res.status(404).json({ error: 'Note not found' });
                return;
            }
            res.json(note);
        }
        catch (error) {
            console.error('Error getting note by ID:', error);
            res.status(500).json({ error: 'Failed to get note' });
        }
    }
    async createNote(req, res) {
        try {
            const data = req.body;
            const note = await this.noteService.createNote(data);
            res.status(201).json(note);
        }
        catch (error) {
            console.error('Error creating note:', error);
            if (error instanceof Error) {
                if (error.message.includes('required') || error.message.includes('empty')) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Failed to create note' });
                }
            }
            else {
                res.status(500).json({ error: 'Failed to create note' });
            }
        }
    }
    async updateNote(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const note = await this.noteService.updateNote(id, data);
            if (!note) {
                res.status(404).json({ error: 'Note not found' });
                return;
            }
            res.json(note);
        }
        catch (error) {
            console.error('Error updating note:', error);
            if (error instanceof Error) {
                if (error.message.includes('required') || error.message.includes('empty')) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Failed to update note' });
                }
            }
            else {
                res.status(500).json({ error: 'Failed to update note' });
            }
        }
    }
    async deleteNote(req, res) {
        try {
            const { id } = req.params;
            const success = await this.noteService.deleteNote(id);
            if (!success) {
                res.status(404).json({ error: 'Note not found' });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            console.error('Error deleting note:', error);
            if (error instanceof Error) {
                if (error.message.includes('required')) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Failed to delete note' });
                }
            }
            else {
                res.status(500).json({ error: 'Failed to delete note' });
            }
        }
    }
    async toggleArchiveNote(req, res) {
        try {
            const { id } = req.params;
            const note = await this.noteService.toggleArchiveNote(id);
            if (!note) {
                res.status(404).json({ error: 'Note not found' });
                return;
            }
            res.json(note);
        }
        catch (error) {
            console.error('Error toggling archive note:', error);
            if (error instanceof Error) {
                if (error.message.includes('required')) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Failed to toggle archive note' });
                }
            }
            else {
                res.status(500).json({ error: 'Failed to toggle archive note' });
            }
        }
    }
    async getNotesByTags(req, res) {
        try {
            const { tagIds } = req.query;
            const { archived } = req.query;
            const tagIdsArray = Array.isArray(tagIds)
                ? tagIds
                : tagIds
                    ? [tagIds]
                    : [];
            const isArchived = archived === 'true';
            const notes = await this.noteService.getNotesByTags(tagIdsArray, isArchived);
            res.json(notes);
        }
        catch (error) {
            console.error('Error getting notes by tags:', error);
            res.status(500).json({ error: 'Failed to get notes by tags' });
        }
    }
    async searchNotes(req, res) {
        try {
            const { q, archived } = req.query;
            const query = q;
            const isArchived = archived === 'true';
            const notes = await this.noteService.searchNotes(query, isArchived);
            res.json(notes);
        }
        catch (error) {
            console.error('Error searching notes:', error);
            res.status(500).json({ error: 'Failed to search notes' });
        }
    }
}
exports.NoteController = NoteController;
//# sourceMappingURL=NoteController.js.map