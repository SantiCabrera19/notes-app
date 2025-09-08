import { Request, Response } from 'express';
export declare class TagController {
    private tagService;
    constructor();
    getAllTags(req: Request, res: Response): Promise<void>;
    getTagById(req: Request, res: Response): Promise<void>;
    createTag(req: Request, res: Response): Promise<void>;
    updateTag(req: Request, res: Response): Promise<void>;
    deleteTag(req: Request, res: Response): Promise<void>;
}
