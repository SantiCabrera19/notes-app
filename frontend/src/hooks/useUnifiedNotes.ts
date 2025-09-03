import { useAuth } from './useAuth'
import { useNotes } from './useNotes'
import { useLocalNotes } from './useLocalNotes'
import { useMemo } from 'react'

export const useUnifiedNotes = () => {
  const { user } = useAuth()
  const remoteNotes = useNotes()
  const localNotes = useLocalNotes()

  // Determinar qué sistema de notas usar (memoizado)
  const isAuthenticated = !!user
  const notesSystem = useMemo(() => 
    isAuthenticated ? remoteNotes : localNotes,
    [isAuthenticated, remoteNotes, localNotes]
  )

  // Operaciones optimizadas usando el sistema seleccionado
  const operations = useMemo(() => ({
    createNote: async (data: { title: string; content: string; tags?: any[] }) => {
      return isAuthenticated 
        ? await remoteNotes.createNote(data)
        : await localNotes.createNote(data)
    },
    
    updateNote: async (id: string, data: { title?: string; content?: string; tags?: any[] }) => {
      return isAuthenticated 
        ? await remoteNotes.updateNote(id, data)
        : await localNotes.updateNote(id, data)
    },
    
    deleteNote: async (id: string) => {
      return isAuthenticated 
        ? await remoteNotes.deleteNote(id)
        : await localNotes.deleteNote(id)
    },
    
    toggleArchive: async (id: string) => {
      return isAuthenticated 
        ? await remoteNotes.toggleArchiveNote(id)
        : await localNotes.toggleArchive(id)
    },
    
    searchNotes: async (query: string) => {
      return isAuthenticated 
        ? await remoteNotes.searchNotes(query)
        : await localNotes.searchNotes(query)
    }
  }), [isAuthenticated, remoteNotes, localNotes])

  // Estado de notas memoizado
  const notesData = useMemo(() => ({
    notes: isAuthenticated ? remoteNotes.notes : localNotes.notes,
    activeNotes: isAuthenticated ? remoteNotes.activeNotes : localNotes.getActiveNotes(),
    archivedNotes: isAuthenticated ? remoteNotes.archivedNotes : localNotes.getArchivedNotes()
  }), [isAuthenticated, remoteNotes, localNotes])
  
  // Métodos de fetch memoizados
  const fetchMethods = useMemo(() => ({
    fetchActiveNotes: isAuthenticated ? remoteNotes.fetchActiveNotes : () => Promise.resolve(),
    fetchArchivedNotes: isAuthenticated ? remoteNotes.fetchArchivedNotes : () => Promise.resolve(),
    fetchAllNotes: isAuthenticated ? remoteNotes.fetchAllNotes : () => Promise.resolve(),
    clearError: isAuthenticated ? remoteNotes.clearError : () => {}
  }), [isAuthenticated, remoteNotes])

  return {
    // Estado optimizado
    ...notesData,
    loading: notesSystem.loading,
    error: isAuthenticated ? remoteNotes.error : null,
    
    // Operaciones optimizadas
    ...operations,
    
    // Estado de autenticación
    isAuthenticated,
    
    // Métodos de fetch optimizados
    ...fetchMethods,
  }
}