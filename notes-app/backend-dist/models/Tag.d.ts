export interface Tag {
    id: string;
    name: string;
    notes?: Note[];
}
export interface CreateTagRequest {
    name: string;
}
export interface UpdateTagRequest {
    name: string;
}
export interface Note {
    id: string;
    title: string;
    content: string;
    isArchived: boolean;
    tags: Tag[];
    createdAt: Date;
    updatedAt: Date;
}
