import express from 'express';
import cors from 'cors';
import { notesRouter } from './routes/notes';
import { tagsRouter } from './routes/tags';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notes', notesRouter);
app.use('/api/tags', tagsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Notes API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}); 