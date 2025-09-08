import { TagRepository } from '../repositories/TagRepository';
import { Tag, CreateTagRequest, UpdateTagRequest } from '../models/Tag';

export class TagService {
  private tagRepository: TagRepository;

  constructor() {
    this.tagRepository = new TagRepository();
  }

  async getAllTags(): Promise<Tag[]> {
    return await this.tagRepository.findAll();
  }

  async getTagById(id: string): Promise<Tag | null> {
    if (!id) {
      throw new Error('Tag ID is required');
    }
    return await this.tagRepository.findById(id);
  }

  async createTag(data: CreateTagRequest): Promise<Tag> {
    if (!data.name || !data.name.trim()) {
      throw new Error('Tag name is required');
    }

    // Check if tag already exists
    const existingTag = await this.tagRepository.findByName(data.name.trim());
    if (existingTag) {
      throw new Error('Tag already exists');
    }

    return await this.tagRepository.create(data);
  }

  async updateTag(id: string, data: UpdateTagRequest): Promise<Tag | null> {
    if (!id) {
      throw new Error('Tag ID is required');
    }

    if (!data.name || !data.name.trim()) {
      throw new Error('Tag name is required');
    }

    // Check if tag exists
    const existingTag = await this.tagRepository.findById(id);
    if (!existingTag) {
      throw new Error('Tag not found');
    }

    // Check if new name already exists (excluding current tag)
    const tagWithSameName = await this.tagRepository.findByName(data.name.trim());
    if (tagWithSameName && tagWithSameName.id !== id) {
      throw new Error('Tag name already exists');
    }

    return await this.tagRepository.update(id, data);
  }

  async deleteTag(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Tag ID is required');
    }

    // Check if tag exists
    const existingTag = await this.tagRepository.findById(id);
    if (!existingTag) {
      throw new Error('Tag not found');
    }

    return await this.tagRepository.delete(id);
  }

  async findOrCreateTag(name: string): Promise<Tag> {
    if (!name || !name.trim()) {
      throw new Error('Tag name is required');
    }

    return await this.tagRepository.findOrCreate(name.trim());
  }

  async getTagsByIds(ids: string[]): Promise<Tag[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    return await this.tagRepository.findByIds(ids);
  }
}
