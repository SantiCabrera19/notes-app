const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'
  : 'http://localhost:3001/api';

export interface Note {
  id: string;
  title: string;
  content: string;
  isArchived: boolean;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
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

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Note endpoints
  async getAllNotes(): Promise<Note[]> {
    return this.request<Note[]>('/notes');
  }

  async getActiveNotes(): Promise<Note[]> {
    return this.request<Note[]>('/notes/active');
  }

  async getArchivedNotes(): Promise<Note[]> {
    return this.request<Note[]>('/notes/archived');
  }

  async getNoteById(id: string): Promise<Note> {
    return this.request<Note>(`/notes/${id}`);
  }

  async createNote(data: CreateNoteRequest): Promise<Note> {
    return this.request<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateNote(id: string, data: UpdateNoteRequest): Promise<Note> {
    return this.request<Note>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteNote(id: string): Promise<void> {
    return this.request<void>(`/notes/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleArchiveNote(id: string): Promise<Note> {
    return this.request<Note>(`/notes/${id}/toggle-archive`, {
      method: 'PATCH',
    });
  }

  async searchNotes(query: string, archived?: boolean): Promise<Note[]> {
    const params = new URLSearchParams({ q: query });
    if (archived !== undefined) {
      params.append('archived', archived.toString());
    }
    return this.request<Note[]>(`/notes/search?${params}`);
  }

  async getNotesByTags(tagIds: string[], archived?: boolean): Promise<Note[]> {
    const params = new URLSearchParams();
    tagIds.forEach(id => params.append('tagIds', id));
    if (archived !== undefined) {
      params.append('archived', archived.toString());
    }
    return this.request<Note[]>(`/notes/by-tags?${params}`);
  }

  // Tag endpoints
  async getAllTags(): Promise<Tag[]> {
    return this.request<Tag[]>('/tags');
  }

  async getTagById(id: string): Promise<Tag> {
    return this.request<Tag>(`/tags/${id}`);
  }

  async createTag(data: CreateTagRequest): Promise<Tag> {
    return this.request<Tag>('/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTag(id: string, data: UpdateTagRequest): Promise<Tag> {
    return this.request<Tag>(`/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTag(id: string): Promise<void> {
    return this.request<void>(`/tags/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService(); 