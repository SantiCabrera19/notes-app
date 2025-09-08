"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagsRouter = void 0;
const express_1 = require("express");
const TagController_1 = require("../controllers/TagController");
const router = (0, express_1.Router)();
exports.tagsRouter = router;
const tagController = new TagController_1.TagController();
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
//# sourceMappingURL=tags.js.map