import { PrismaClient } from '../generated/prisma';
import { Tag, CreateTagRequest, UpdateTagRequest } from '../models/Tag';

const prisma = new PrismaClient();

export class TagRepository {
  async findAll(): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    return tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      notes: [], // We'll load notes separately if needed
    }));
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });
    
    if (!tag) return null;
    
    return {
      id: tag.id,
      name: tag.name,
      notes: [], // We'll load notes separately if needed
    };
  }

  async findByName(name: string): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({
      where: { name },
    });
    
    if (!tag) return null;
    
    return {
      id: tag.id,
      name: tag.name,
      notes: [], // We'll load notes separately if needed
    };
  }

  async create(data: CreateTagRequest): Promise<Tag> {
    const tag = await prisma.tag.create({
      data: {
        name: data.name.trim(),
      },
    });
    
    return {
      id: tag.id,
      name: tag.name,
      notes: [],
    };
  }

  async update(id: string, data: UpdateTagRequest): Promise<Tag | null> {
    try {
      const tag = await prisma.tag.update({
        where: { id },
        data: {
          name: data.name.trim(),
        },
      });
      
      return {
        id: tag.id,
        name: tag.name,
        notes: [],
      };
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.tag.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findOrCreate(name: string): Promise<Tag> {
    const existingTag = await this.findByName(name.trim());
    if (existingTag) {
      return existingTag;
    }
    return await this.create({ name: name.trim() });
  }

  async findByIds(ids: string[]): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    
    return tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      notes: [],
    }));
  }
} 