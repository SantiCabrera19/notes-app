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

import { TagService } from '../../lib/services/TagService';
import { UpdateTagRequest } from '../../lib/models/Tag';

const tagService = new TagService();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method } = req;
  const id = req.query.id as string;

  if (!id) {
    return res.status(400).json({ error: 'Tag ID is required' });
  }

  try {
    switch (method) {
      case 'GET':
        // GET /api/tags/[id]
        const tag = await tagService.getTagById(id);
        if (!tag) {
          return res.status(404).json({ error: 'Tag not found' });
        }
        return res.json(tag);

      case 'PUT':
        // PUT /api/tags/[id]
        const updateData: UpdateTagRequest = req.body;
        const updatedTag = await tagService.updateTag(id, updateData);
        if (!updatedTag) {
          return res.status(404).json({ error: 'Tag not found' });
        }
        return res.json(updatedTag);

      case 'DELETE':
        // DELETE /api/tags/[id]
        const success = await tagService.deleteTag(id);
        if (!success) {
          return res.status(404).json({ error: 'Tag not found' });
        }
        return res.status(204).end();

      default:
        res.setHeader('Allow', 'GET, PUT, DELETE');
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in tags/[id] API:', error);
    if (error instanceof Error) {
      if (error.message === 'Tag name is required') {
        return res.status(400).json({ error: error.message });
      } else if (error.message === 'Tag already exists') {
        return res.status(409).json({ error: error.message });
      } else if (error.message === 'Tag not found') {
        return res.status(404).json({ error: error.message });
      } else if (error.message === 'Tag name already exists') {
        return res.status(409).json({ error: error.message });
      }
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
