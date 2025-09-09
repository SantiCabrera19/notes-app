export interface Note {
  id: string;
  title: string;
  content: string;
  isArchived: boolean;
  userId: string;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tagIds?: string[];
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  isArchived?: boolean;
  tagIds?: string[];
}

export interface Tag {
  id: string;
  name: string;
}
