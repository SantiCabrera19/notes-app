import { useAuth } from './useAuth'
import { useNotes } from './useNotes'
import { useLocalNotes } from './useLocalNotes'
import { useCallback } from 'react'
import type { Note } from '../services/api'

export const useUnifiedNotes = () => {
  const { user } = useAuth()
  const remoteNotes = useNotes()
  const localNotes = useLocalNotes()

  // Determinar qué sistema de notas usar
  const isAuthenticated = !!user
  const notesSystem = isAuthenticated ? remoteNotes : localNotes

  // Crear nota
  const createNote = useCallback(async (data: { title: string; content: string; tags?: any[] }) => {
    if (isAuthenticated) {
      return await remoteNotes.createNote(data)
    } else {
      return await localNotes.createNote(data)
    }
  }, [isAuthenticated, remoteNotes, localNotes])

  // Actualizar nota
  const updateNote = useCallback(async (id: string, data: { title?: string; content?: string; tags?: any[] }) => {
    if (isAuthenticated) {
      return await remoteNotes.updateNote(id, data)
    } else {
      return await localNotes.updateNote(id, data)
    }
  }, [isAuthenticated, remoteNotes, localNotes])

  // Eliminar nota
  const deleteNote = useCallback(async (id: string) => {
    if (isAuthenticated) {
      return await remoteNotes.deleteNote(id)
    } else {
      return await localNotes.deleteNote(id)
    }
  }, [isAuthenticated, remoteNotes, localNotes])

  // Cambiar estado de archivo
  const toggleArchive = useCallback(async (id: string) => {
    if (isAuthenticated) {
      return await remoteNotes.toggleArchiveNote(id)
    } else {
      return await localNotes.toggleArchive(id)
    }
  }, [isAuthenticated, remoteNotes, localNotes])

  // Buscar notas
  const searchNotes = useCallback(async (query: string) => {
    if (isAuthenticated) {
      return await remoteNotes.searchNotes(query)
    } else {
      return await localNotes.searchNotes(query)
    }
  }, [isAuthenticated, remoteNotes, localNotes])

  // Obtener notas activas
  const getActiveNotes = useCallback(() => {
    if (isAuthenticated) {
      return remoteNotes.activeNotes
    } else {
      return localNotes.getActiveNotes()
    }
  }, [isAuthenticated, remoteNotes, localNotes])

  // Obtener notas archivadas
  const getArchivedNotes = useCallback(() => {
    if (isAuthenticated) {
      return remoteNotes.archivedNotes
    } else {
      return localNotes.getArchivedNotes()
    }
  }, [isAuthenticated, remoteNotes, localNotes])

  // Obtener todas las notas
  const getAllNotes = useCallback(() => {
    if (isAuthenticated) {
      return remoteNotes.notes
    } else {
      return localNotes.notes
    }
  }, [isAuthenticated, remoteNotes, localNotes])

  return {
    // Estado
    notes: getAllNotes(),
    activeNotes: getActiveNotes(),
    archivedNotes: getArchivedNotes(),
    loading: notesSystem.loading,
    error: isAuthenticated ? remoteNotes.error : null,
    
    // Acciones
    createNote,
    updateNote,
    deleteNote,
    toggleArchive,
    searchNotes,
    
    // Estado de autenticación
    isAuthenticated,
    
    // Métodos específicos del sistema remoto
    fetchActiveNotes: isAuthenticated ? remoteNotes.fetchActiveNotes : () => {},
    fetchArchivedNotes: isAuthenticated ? remoteNotes.fetchArchivedNotes : () => {},
    fetchAllNotes: isAuthenticated ? remoteNotes.fetchAllNotes : () => {},
    clearError: isAuthenticated ? remoteNotes.clearError : () => {},
  }
} 