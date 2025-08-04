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
      const tags = await prisma.tag.findMany({
        orderBy: {
          name: 'asc',
        },
      });
      res.status(200).json(tags);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tags' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name } = req.body;
      const tag = await prisma.tag.create({
        data: { name },
      });
      res.status(201).json(tag);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create tag' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 