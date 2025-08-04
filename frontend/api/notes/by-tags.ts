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
      const { tagIds, archived } = req.query;
      const tagIdsArray = Array.isArray(tagIds) ? tagIds : [tagIds];
      const isArchived = archived === 'true';

      const notes = await prisma.note.findMany({
        where: {
          AND: [
            {
              tags: {
                some: {
                  id: { in: tagIdsArray as string[] },
                },
              },
            },
            { isArchived: isArchived },
          ],
        },
        include: {
          tags: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notes by tags' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 