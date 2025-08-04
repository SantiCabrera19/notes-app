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

  if (req.method === 'GET') {
    try {
      const notes = await prisma.note.findMany({
        include: {
          tags: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, content, tagIds } = req.body;
      const note = await prisma.note.create({
        data: {
          title,
          content,
          tags: {
            connect: tagIds?.map((id: string) => ({ id })) || [],
          },
        },
        include: {
          tags: true,
        },
      });
      res.status(201).json(note);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create note' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 