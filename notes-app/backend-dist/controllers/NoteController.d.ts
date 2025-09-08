import { Request, Response } from 'express';
export declare class NoteController {
    private noteService;
    constructor();
    getAllNotes(req: Request, res: Response): Promise<void>;
    getActiveNotes(req: Request, res: Response): Promise<void>;
    getArchivedNotes(req: Request, res: Response): Promise<void>;
    getNoteById(req: Request, res: Response): Promise<void>;
    createNote(req: Request, res: Response): Promise<void>;
    updateNote(req: Request, res: Response): Promise<void>;
    deleteNote(req: Request, res: Response): Promise<void>;
    toggleArchiveNote(req: Request, res: Response): Promise<void>;
    getNotesByTags(req: Request, res: Response): Promise<void>;
    searchNotes(req: Request, res: Response): Promise<void>;
}
