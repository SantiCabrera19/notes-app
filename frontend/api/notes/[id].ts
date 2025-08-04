import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const note = await prisma.note.findUnique({
        where: { id: id as string },
        include: {
          tags: true,
        },
      });
      
      if (!note) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }
      
      res.status(200).json(note);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch note' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, content, isArchived, tagIds } = req.body;
      const note = await prisma.note.update({
        where: { id: id as string },
        data: {
          title,
          content,
          isArchived,
          tags: {
            set: tagIds?.map((tagId: string) => ({ id: tagId })) || [],
          },
        },
        include: {
          tags: true,
        },
      });
      res.status(200).json(note);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update note' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.note.delete({
        where: { id: id as string },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete note' });
    }
  } else if (req.method === 'PATCH') {
    try {
      const note = await prisma.note.update({
        where: { id: id as string },
        data: {
          isArchived: {
            not: true,
          },
        },
        include: {
          tags: true,
        },
      });
      res.status(200).json(note);
    } catch (error) {
      res.status(500).json({ error: 'Failed to toggle archive' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 