import express from 'express';
import cors from 'cors';
import { notesRouter } from './routes/notes';
import { tagsRouter } from './routes/tags';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (support both /api/* and root-level paths for serverless mounts)
app.use(['/api/notes', '/notes'], notesRouter);
app.use(['/api/tags', '/tags'], tagsRouter);

// Health check (support /health and /api/health)
app.get(['/health', '/api/health'], (_req, res) => {
  res.json({ status: 'OK', message: 'Notes API is running' });
});

export default app;
