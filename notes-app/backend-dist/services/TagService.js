"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const TagRepository_1 = require("../repositories/TagRepository");
class TagService {
    constructor() {
        this.tagRepository = new TagRepository_1.TagRepository();
    }
    async getAllTags() {
        return await this.tagRepository.findAll();
    }
    async getTagById(id) {
        if (!id) {
            throw new Error('Tag ID is required');
        }
        return await this.tagRepository.findById(id);
    }
    async createTag(data) {
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
    async updateTag(id, data) {
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
    async deleteTag(id) {
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
    async findOrCreateTag(name) {
        if (!name || !name.trim()) {
            throw new Error('Tag name is required');
        }
        return await this.tagRepository.findOrCreate(name.trim());
    }
    async getTagsByIds(ids) {
        if (!ids || ids.length === 0) {
            return [];
        }
        return await this.tagRepository.findByIds(ids);
    }
}
exports.TagService = TagService;
//# sourceMappingURL=TagService.js.map