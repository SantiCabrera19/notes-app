import { Router } from 'express';
import { NoteController } from '../controllers/NoteController';

const router = Router();
const noteController = new NoteController();

// GET /api/notes - Get all notes
router.get('/', (req, res) => noteController.getAllNotes(req, res));

// GET /api/notes/active - Get active notes
router.get('/active', (req, res) => noteController.getActiveNotes(req, res));

// GET /api/notes/archived - Get archived notes
router.get('/archived', (req, res) => noteController.getArchivedNotes(req, res));

// GET /api/notes/search - Search notes
router.get('/search', (req, res) => noteController.searchNotes(req, res));

// GET /api/notes/by-tags - Get notes by tags
router.get('/by-tags', (req, res) => noteController.getNotesByTags(req, res));

// GET /api/notes/:id - Get note by ID
router.get('/:id', (req, res) => noteController.getNoteById(req, res));

// POST /api/notes - Create new note
router.post('/', (req, res) => noteController.createNote(req, res));

// PUT /api/notes/:id - Update note
router.put('/:id', (req, res) => noteController.updateNote(req, res));

// DELETE /api/notes/:id - Delete note
router.delete('/:id', (req, res) => noteController.deleteNote(req, res));

// PATCH /api/notes/:id/toggle-archive - Toggle archive status
router.patch('/:id/toggle-archive', (req, res) => noteController.toggleArchiveNote(req, res));

export { router as notesRouter }; 