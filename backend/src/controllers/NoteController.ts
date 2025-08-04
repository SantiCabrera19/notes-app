import { Request, Response } from 'express';
import { NoteService } from '../services/NoteService';
import { CreateNoteRequest, UpdateNoteRequest } from '../models/Note';

export class NoteController {
  private noteService: NoteService;

  constructor() {
    this.noteService = new NoteService();
  }

  async getAllNotes(req: Request, res: Response): Promise<void> {
    try {
      const notes = await this.noteService.getAllNotes();
      res.json(notes);
    } catch (error) {
      console.error('Error getting all notes:', error);
      res.status(500).json({ error: 'Failed to get notes' });
    }
  }

  async getActiveNotes(req: Request, res: Response): Promise<void> {
    try {
      const notes = await this.noteService.getActiveNotes();
      res.json(notes);
    } catch (error) {
      console.error('Error getting active notes:', error);
      res.status(500).json({ error: 'Failed to get active notes' });
    }
  }

  async getArchivedNotes(req: Request, res: Response): Promise<void> {
    try {
      const notes = await this.noteService.getArchivedNotes();
      res.json(notes);
    } catch (error) {
      console.error('Error getting archived notes:', error);
      res.status(500).json({ error: 'Failed to get archived notes' });
    }
  }

  async getNoteById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const note = await this.noteService.getNoteById(id);
      
      if (!note) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }
      
      res.json(note);
    } catch (error) {
      console.error('Error getting note by ID:', error);
      res.status(500).json({ error: 'Failed to get note' });
    }
  }

  async createNote(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateNoteRequest = req.body;
      const note = await this.noteService.createNote(data);
      res.status(201).json(note);
    } catch (error) {
      console.error('Error creating note:', error);
      if (error instanceof Error) {
        if (error.message.includes('required') || error.message.includes('empty')) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Failed to create note' });
        }
      } else {
        res.status(500).json({ error: 'Failed to create note' });
      }
    }
  }

  async updateNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateNoteRequest = req.body;
      const note = await this.noteService.updateNote(id, data);
      
      if (!note) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }
      
      res.json(note);
    } catch (error) {
      console.error('Error updating note:', error);
      if (error instanceof Error) {
        if (error.message.includes('required') || error.message.includes('empty')) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Failed to update note' });
        }
      } else {
        res.status(500).json({ error: 'Failed to update note' });
      }
    }
  }

  async deleteNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.noteService.deleteNote(id);
      
      if (!success) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting note:', error);
      if (error instanceof Error) {
        if (error.message.includes('required')) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Failed to delete note' });
        }
      } else {
        res.status(500).json({ error: 'Failed to delete note' });
      }
    }
  }

  async toggleArchiveNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const note = await this.noteService.toggleArchiveNote(id);
      
      if (!note) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }
      
      res.json(note);
    } catch (error) {
      console.error('Error toggling archive note:', error);
      if (error instanceof Error) {
        if (error.message.includes('required')) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Failed to toggle archive note' });
        }
      } else {
        res.status(500).json({ error: 'Failed to toggle archive note' });
      }
    }
  }

  async getNotesByTags(req: Request, res: Response): Promise<void> {
    try {
      const { tagIds } = req.query;
      const { archived } = req.query;
      
      const tagIdsArray = Array.isArray(tagIds) 
        ? tagIds as string[] 
        : tagIds 
          ? [tagIds as string] 
          : [];
      
      const isArchived = archived === 'true';
      
      const notes = await this.noteService.getNotesByTags(tagIdsArray, isArchived);
      res.json(notes);
    } catch (error) {
      console.error('Error getting notes by tags:', error);
      res.status(500).json({ error: 'Failed to get notes by tags' });
    }
  }

  async searchNotes(req: Request, res: Response): Promise<void> {
    try {
      const { q, archived } = req.query;
      const query = q as string;
      const isArchived = archived === 'true';
      
      const notes = await this.noteService.searchNotes(query, isArchived);
      res.json(notes);
    } catch (error) {
      console.error('Error searching notes:', error);
      res.status(500).json({ error: 'Failed to search notes' });
    }
  }
} 