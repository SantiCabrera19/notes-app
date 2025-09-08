import { Tag, CreateTagRequest, UpdateTagRequest } from '../models/Tag';
export declare class TagService {
    private tagRepository;
    constructor();
    getAllTags(): Promise<Tag[]>;
    getTagById(id: string): Promise<Tag | null>;
    createTag(data: CreateTagRequest): Promise<Tag>;
    updateTag(id: string, data: UpdateTagRequest): Promise<Tag | null>;
    deleteTag(id: string): Promise<boolean>;
    findOrCreateTag(name: string): Promise<Tag>;
    getTagsByIds(ids: string[]): Promise<Tag[]>;
}
