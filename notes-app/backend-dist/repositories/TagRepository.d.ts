import { Tag, CreateTagRequest, UpdateTagRequest } from '../models/Tag';
export declare class TagRepository {
    findAll(): Promise<Tag[]>;
    findById(id: string): Promise<Tag | null>;
    findByName(name: string): Promise<Tag | null>;
    create(data: CreateTagRequest): Promise<Tag>;
    update(id: string, data: UpdateTagRequest): Promise<Tag | null>;
    delete(id: string): Promise<boolean>;
    findOrCreate(name: string): Promise<Tag>;
    findByIds(ids: string[]): Promise<Tag[]>;
}
