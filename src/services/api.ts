import { supabase } from '../lib/supabase';

const API_BASE_URL = '/api';

// Helper function to get auth headers
async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  return headers;
}

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
    const headers = await getAuthHeaders();
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        ...headers,
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    // Handle empty responses (e.g., 204 No Content) or non-JSON bodies gracefully
    if (response.status === 204) {
      return undefined as unknown as T;
    }
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return undefined as unknown as T;
    }
    const text = await response.text();
    if (!text) {
      return undefined as unknown as T;
    }
    return JSON.parse(text) as T;
  }

  // Notes API
  async getActiveNotes(): Promise<Note[]> {
    return this.request<Note[]>('/notes');
  }

  async getArchivedNotes(): Promise<Note[]> {
    return this.request<Note[]>('/notes?archived=true');
  }

  async createNote(note: CreateNoteRequest): Promise<Note> {
    return this.request<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  }

  async updateNote(id: string, note: UpdateNoteRequest): Promise<Note> {
    return this.request<Note>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    });
  }

  async deleteNote(id: string): Promise<void> {
    return this.request<void>(`/notes/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleArchiveNote(id: string): Promise<Note> {
    return this.request<Note>(`/notes/${id}?action=toggle-archive`, {
      method: 'PATCH',
    });
  }

  async searchNotes(query: string, archived: boolean = false): Promise<Note[]> {
    return this.request<Note[]>(`/notes?q=${encodeURIComponent(query)}&archived=${archived}`);
  }

  async getNotesByTags(tagIds: string[], archived: boolean = false): Promise<Note[]> {
    const tagIdsParam = tagIds.join(',');
    return this.request<Note[]>(`/notes?tagIds=${encodeURIComponent(tagIdsParam)}&archived=${archived}`);
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

// Legacy exports for backward compatibility
export const notesApi = {
  getAll: () => apiService.getActiveNotes(),
  getArchived: () => apiService.getArchivedNotes(),
  create: (note: CreateNoteRequest) => apiService.createNote(note),
  update: (id: string, note: UpdateNoteRequest) => apiService.updateNote(id, note),
  delete: (id: string) => apiService.deleteNote(id),
  toggleArchive: (id: string) => apiService.toggleArchiveNote(id),
  search: (query: string, archived?: boolean) => apiService.searchNotes(query, archived),
  getByTags: (tagIds: string[], archived?: boolean) => apiService.getNotesByTags(tagIds, archived),
}; 