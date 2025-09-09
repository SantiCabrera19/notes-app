import { PrismaClient } from '@prisma/client';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../models/Note';

const prisma = new PrismaClient();

export class NoteRepository {
  async findAll(archived?: boolean, userId?: string): Promise<Note[]> {
    const whereClause: any = {};
    
    if (archived !== undefined) {
      whereClause.isArchived = archived;
    }
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    return await prisma.note.findMany({
      where: whereClause,
      include: {
        tags: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findById(id: string, userId?: string): Promise<Note | null> {
    const whereClause: any = { id };
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    return await prisma.note.findUnique({
      where: whereClause,
      include: {
        tags: true,
      },
    });
  }

  async create(data: CreateNoteRequest, userId: string): Promise<Note> {
    const { tagIds, ...noteData } = data;
    
    return await prisma.note.create({
      data: {
        ...noteData,
        userId,
        tags: tagIds && tagIds.length > 0 ? {
          connect: tagIds.map(id => ({ id })),
        } : undefined,
      },
      include: {
        tags: true,
      },
    });
  }

  async update(id: string, data: UpdateNoteRequest, userId: string): Promise<Note | null> {
    const { tagIds, ...noteData } = data;
    
    return await prisma.note.update({
      where: { 
        id,
        userId // Only update notes owned by this user
      },
      data: {
        ...noteData,
        tags: tagIds ? {
          set: tagIds.length > 0 ? tagIds.map(tagId => ({ id: tagId })) : [],
        } : undefined,
      },
      include: {
        tags: true,
      },
    });
  }

  async delete(id: string, userId: string): Promise<boolean> {
    try {
      await prisma.note.delete({
        where: { 
          id,
          userId // Only delete notes owned by this user
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async toggleArchive(id: string, userId: string): Promise<Note | null> {
    const note = await this.findById(id, userId);
    if (!note) return null;

    return await prisma.note.update({
      where: { 
        id,
        userId // Only toggle notes owned by this user
      },
      data: {
        isArchived: !note.isArchived,
      },
      include: {
        tags: true,
      },
    });
  }

  async findByTags(tagIds: string[], archived?: boolean, userId?: string): Promise<Note[]> {
    const whereConditions: any[] = [
      {
        tags: {
          some: {
            id: {
              in: tagIds,
            },
          },
        },
      },
    ];
    
    if (archived !== undefined) {
      whereConditions.push({ isArchived: archived });
    }
    
    if (userId) {
      whereConditions.push({ userId });
    }
    
    return await prisma.note.findMany({
      where: {
        AND: whereConditions,
      },
      include: {
        tags: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async searchNotes(query: string, archived?: boolean, userId?: string): Promise<Note[]> {
    const whereConditions: any[] = [
      {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    ];
    
    if (archived !== undefined) {
      whereConditions.push({ isArchived: archived });
    }
    
    if (userId) {
      whereConditions.push({ userId });
    }
    
    return await prisma.note.findMany({
      where: {
        AND: whereConditions,
      },
      include: {
        tags: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }
}
