import express from 'express';
import cors from 'cors';
import { notesRouter } from './routes/notes';
import { tagsRouter } from './routes/tags';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notes', notesRouter);
app.use('/api/tags', tagsRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Notes API is running' });
});

export default app;
