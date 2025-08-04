import { PrismaClient } from '../generated/prisma';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../models/Note';

const prisma = new PrismaClient();

export class NoteRepository {
  async findAll(archived?: boolean): Promise<Note[]> {
    return await prisma.note.findMany({
      where: archived !== undefined ? { isArchived: archived } : {},
      include: {
        tags: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Note | null> {
    return await prisma.note.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    });
  }

  async create(data: CreateNoteRequest): Promise<Note> {
    const { tagIds, ...noteData } = data;
    
    return await prisma.note.create({
      data: {
        ...noteData,
        tags: tagIds && tagIds.length > 0 ? {
          connect: tagIds.map(id => ({ id })),
        } : undefined,
      },
      include: {
        tags: true,
      },
    });
  }

  async update(id: string, data: UpdateNoteRequest): Promise<Note | null> {
    const { tagIds, ...noteData } = data;
    
    return await prisma.note.update({
      where: { id },
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

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.note.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async toggleArchive(id: string): Promise<Note | null> {
    const note = await this.findById(id);
    if (!note) return null;

    return await prisma.note.update({
      where: { id },
      data: {
        isArchived: !note.isArchived,
      },
      include: {
        tags: true,
      },
    });
  }

  async findByTags(tagIds: string[], archived?: boolean): Promise<Note[]> {
    return await prisma.note.findMany({
      where: {
        AND: [
          archived !== undefined ? { isArchived: archived } : {},
          {
            tags: {
              some: {
                id: {
                  in: tagIds,
                },
              },
            },
          },
        ],
      },
      include: {
        tags: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async searchNotes(query: string, archived?: boolean): Promise<Note[]> {
    return await prisma.note.findMany({
      where: {
        AND: [
          archived !== undefined ? { isArchived: archived } : {},
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
        ],
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