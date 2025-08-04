import { Router } from 'express';
import { TagController } from '../controllers/TagController';

const router = Router();
const tagController = new TagController();

// GET /api/tags - Get all tags
router.get('/', (req, res) => tagController.getAllTags(req, res));

// GET /api/tags/:id - Get tag by ID
router.get('/:id', (req, res) => tagController.getTagById(req, res));

// POST /api/tags - Create new tag
router.post('/', (req, res) => tagController.createTag(req, res));

// PUT /api/tags/:id - Update tag
router.put('/:id', (req, res) => tagController.updateTag(req, res));

// DELETE /api/tags/:id - Delete tag
router.delete('/:id', (req, res) => tagController.deleteTag(req, res));

export { router as tagsRouter }; 