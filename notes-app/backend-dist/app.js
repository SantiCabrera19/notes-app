"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notes_1 = require("./routes/notes");
const tags_1 = require("./routes/tags");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/notes', notes_1.notesRouter);
app.use('/api/tags', tags_1.tagsRouter);
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'OK', message: 'Notes API is running' });
});
exports.default = app;
//# sourceMappingURL=app.js.map