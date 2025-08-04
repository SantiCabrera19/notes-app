import { Request, Response } from 'express';
import { TagService } from '../services/TagService';
import { CreateTagRequest, UpdateTagRequest } from '../models/Tag';

export class TagController {
  private tagService: TagService;

  constructor() {
    this.tagService = new TagService();
  }

  async getAllTags(req: Request, res: Response): Promise<void> {
    try {
      const tags = await this.tagService.getAllTags();
      res.json(tags);
    } catch (error) {
      console.error('Error getting all tags:', error);
      res.status(500).json({ error: 'Failed to get tags' });
    }
  }

  async getTagById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const tag = await this.tagService.getTagById(id);
      
      if (!tag) {
        res.status(404).json({ error: 'Tag not found' });
        return;
      }
      
      res.json(tag);
    } catch (error) {
      console.error('Error getting tag by ID:', error);
      res.status(500).json({ error: 'Failed to get tag' });
    }
  }

  async createTag(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateTagRequest = req.body;
      const tag = await this.tagService.createTag(data);
      res.status(201).json(tag);
    } catch (error) {
      console.error('Error creating tag:', error);
      if (error instanceof Error) {
        if (error.message === 'Tag name is required') {
          res.status(400).json({ error: error.message });
        } else if (error.message === 'Tag already exists') {
          res.status(409).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Failed to create tag' });
        }
      } else {
        res.status(500).json({ error: 'Failed to create tag' });
      }
    }
  }

  async updateTag(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateTagRequest = req.body;
      const tag = await this.tagService.updateTag(id, data);
      
      if (!tag) {
        res.status(404).json({ error: 'Tag not found' });
        return;
      }
      
      res.json(tag);
    } catch (error) {
      console.error('Error updating tag:', error);
      if (error instanceof Error) {
        if (error.message === 'Tag ID is required' || error.message === 'Tag name is required') {
          res.status(400).json({ error: error.message });
        } else if (error.message === 'Tag not found') {
          res.status(404).json({ error: error.message });
        } else if (error.message === 'Tag name already exists') {
          res.status(409).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Failed to update tag' });
        }
      } else {
        res.status(500).json({ error: 'Failed to update tag' });
      }
    }
  }

  async deleteTag(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.tagService.deleteTag(id);
      
      if (!success) {
        res.status(404).json({ error: 'Tag not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting tag:', error);
      if (error instanceof Error) {
        if (error.message === 'Tag ID is required') {
          res.status(400).json({ error: error.message });
        } else if (error.message === 'Tag not found') {
          res.status(404).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Failed to delete tag' });
        }
      } else {
        res.status(500).json({ error: 'Failed to delete tag' });
      }
    }
  }
} 