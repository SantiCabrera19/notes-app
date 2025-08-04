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
      const tag = await prisma.tag.findUnique({
        where: { id: id as string },
      });
      
      if (!tag) {
        res.status(404).json({ error: 'Tag not found' });
        return;
      }
      
      res.status(200).json(tag);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tag' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { name } = req.body;
      const tag = await prisma.tag.update({
        where: { id: id as string },
        data: { name },
      });
      res.status(200).json(tag);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update tag' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.tag.delete({
        where: { id: id as string },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete tag' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 