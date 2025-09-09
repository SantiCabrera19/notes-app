interface VercelRequest {
  method?: string;
  query: { [key: string]: string | string[] | undefined };
  body?: any;
  headers?: { [key: string]: string | undefined };
}

interface VercelResponse {
  json: (object: any) => VercelResponse;
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => void;
  end: (chunk?: any) => void;
}
import { NoteService } from '../lib/services/NoteService';
import type { CreateNoteRequest, UpdateNoteRequest } from '../lib/models/Note';
import { authenticateUser, requireAuth } from '../lib/middleware/auth';

const noteService = new NoteService();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  const { method, query } = req;
  
  // Authenticate user
  const user = await authenticateUser(req.headers?.authorization as string);

  try {
    switch (method) {
      case 'GET':
        // GET requests can be public (for now) but filter by user if authenticated
        if (query.archived === 'true') {
          // GET /api/notes?archived=true
          const archivedNotes = await noteService.getArchivedNotes(user?.id || '');
          return res.json(user ? archivedNotes : []);
        } else if (query.tagIds) {
          // GET /api/notes?tagIds=...&archived=...
          const tagIdsArray = Array.isArray(query.tagIds) 
            ? query.tagIds as string[] 
            : [query.tagIds as string];
          const isArchived = query.archived === 'true';
          const notes = await noteService.getNotesByTags(tagIdsArray, user?.id || '', isArchived);
          return res.json(user ? notes : []);
        } else if (query.q) {
          // GET /api/notes?q=...&archived=...
          const searchQuery = query.q as string;
          const isArchived = query.archived === 'true';
          const notes = await noteService.searchNotes(searchQuery, user?.id || '', isArchived);
          return res.json(user ? notes : []);
        } else {
          // GET /api/notes - get active notes by default
          const notes = await noteService.getActiveNotes(user?.id || '');
          return res.json(user ? notes : []);
        }

      case 'POST':
        // POST /api/notes - requires authentication
        const authenticatedUser = requireAuth(user);
        const createData: CreateNoteRequest = req.body;
        const newNote = await noteService.createNote(createData, authenticatedUser.id);
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
