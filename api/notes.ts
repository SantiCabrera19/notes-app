interface VercelRequest {
  method?: string;
  query: { [key: string]: string | string[] | undefined };
  body: any;
}

interface VercelResponse {
  json: (object: any) => VercelResponse;
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => void;
  end: (chunk?: any) => void;
}
import { NoteService } from '../lib/services/NoteService';
import type { CreateNoteRequest, UpdateNoteRequest } from '../lib/models/Note';

const noteService = new NoteService();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  const { method, query } = req;

  try {
    switch (method) {
      case 'GET':
        // Handle different GET endpoints
        if (query.archived === 'true') {
          // GET /api/notes?archived=true
          const archivedNotes = await noteService.getArchivedNotes();
          return res.json(archivedNotes);
        } else if (query.tagIds) {
          // GET /api/notes?tagIds=...&archived=...
          const tagIdsArray = Array.isArray(query.tagIds) 
            ? query.tagIds as string[] 
            : [query.tagIds as string];
          const isArchived = query.archived === 'true';
          const notes = await noteService.getNotesByTags(tagIdsArray, isArchived);
          return res.json(notes);
        } else if (query.q) {
          // GET /api/notes?q=...&archived=...
          const searchQuery = query.q as string;
          const isArchived = query.archived === 'true';
          const notes = await noteService.searchNotes(searchQuery, isArchived);
          return res.json(notes);
        } else {
          // GET /api/notes - get active notes by default
          const notes = await noteService.getActiveNotes();
          return res.json(notes);
        }

      case 'POST':
        // POST /api/notes
        const createData: CreateNoteRequest = req.body;
        const newNote = await noteService.createNote(createData);
        return res.status(201).json(newNote);

      case 'PUT':
        // PUT /api/notes - not supported at collection level
        return res.status(400).json({ error: 'PUT method not supported for collection. Use /api/notes/[id]' });

      case 'PATCH':
        // PATCH /api/notes - not supported at collection level
        return res.status(400).json({ error: 'PATCH method not supported for collection. Use /api/notes/[id]' });

      case 'DELETE':
        // DELETE /api/notes - not supported at collection level
        return res.status(400).json({ error: 'DELETE method not supported for collection. Use /api/notes/[id]' });

      default:
        res.setHeader('Allow', 'GET, POST');
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in notes API:', error);
    if (error instanceof Error) {
      if (error.message.includes('required') || error.message.includes('empty')) {
        return res.status(400).json({ error: error.message });
      } else if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
