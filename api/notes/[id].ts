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

import { NoteService } from '../../lib/services/NoteService';
import type { UpdateNoteRequest } from '../../lib/models/Note';

const noteService = new NoteService();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, query } = req;
  const id = query.id as string;

  if (!id) {
    return res.status(400).json({ error: 'Note ID is required' });
  }

  try {
    switch (method) {
      case 'GET':
        // GET /api/notes/[id]
        const note = await noteService.getNoteById(id);
        if (!note) {
          return res.status(404).json({ error: 'Note not found' });
        }
        return res.json(note);

      case 'PUT':
        // PUT /api/notes/[id] or PUT /api/notes/[id]?action=toggle-archive
        if (query.action === 'toggle-archive') {
          const toggledNote = await noteService.toggleArchiveNote(id);
          if (!toggledNote) {
            return res.status(404).json({ error: 'Note not found' });
          }
          return res.json(toggledNote);
        } else {
          // Regular update
          const updateData: UpdateNoteRequest = req.body;
          const updatedNote = await noteService.updateNote(id, updateData);
          if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found' });
          }
          return res.json(updatedNote);
        }

      case 'PATCH':
        // PATCH /api/notes/[id]?action=toggle-archive
        if (query.action === 'toggle-archive') {
          const toggledNote = await noteService.toggleArchiveNote(id);
          if (!toggledNote) {
            return res.status(404).json({ error: 'Note not found' });
          }
          return res.json(toggledNote);
        } else {
          return res.status(400).json({ error: 'Invalid action for PATCH method' });
        }

      case 'DELETE':
        // DELETE /api/notes/[id]
        const success = await noteService.deleteNote(id);
        if (!success) {
          return res.status(404).json({ error: 'Note not found' });
        }
        return res.status(204).end();

      default:
        res.setHeader('Allow', 'GET, PUT, DELETE, PATCH');
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in notes/[id] API:', error);
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
