import { useState, useCallback, useEffect } from 'react'
import type { Note } from '../services/api'

interface LocalNote {
  id: string
  title: string
  content: string
  isArchived: boolean
  tags: any[]
  createdAt: string
  updatedAt: string
}

const LOCAL_STORAGE_KEY = 'notes_app_local_notes'

export const useLocalNotes = () => {
  const [notes, setNotes] = useState<LocalNote[]>([])
  const [loading, setLoading] = useState(false)

  // Cargar notas del localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        setNotes(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading local notes:', error)
    }
  }, [])

  // Guardar notas en localStorage
  const saveToStorage = useCallback((newNotes: LocalNote[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newNotes))
    } catch (error) {
      console.error('Error saving local notes:', error)
    }
  }, [])

  // Crear nota
  const createNote = useCallback(async (data: { title: string; content: string; tags?: any[] }) => {
    const newNote: LocalNote = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: data.title,
      content: data.content,
      isArchived: false,
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedNotes = [...notes, newNote]
    setNotes(updatedNotes)
    saveToStorage(updatedNotes)
    return newNote
  }, [notes, saveToStorage])

  // Actualizar nota
  const updateNote = useCallback(async (id: string, data: { title?: string; content?: string; tags?: any[] }) => {
    const updatedNotes = notes.map(note => 
      note.id === id 
        ? { 
            ...note, 
            ...data, 
            updatedAt: new Date().toISOString() 
          }
        : note
    )
    setNotes(updatedNotes)
    saveToStorage(updatedNotes)
  }, [notes, saveToStorage])

  // Eliminar nota
  const deleteNote = useCallback(async (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id)
    setNotes(updatedNotes)
    saveToStorage(updatedNotes)
  }, [notes, saveToStorage])

  // Cambiar estado de archivo
  const toggleArchive = useCallback(async (id: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id 
        ? { ...note, isArchived: !note.isArchived, updatedAt: new Date().toISOString() }
        : note
    )
    setNotes(updatedNotes)
    saveToStorage(updatedNotes)
    return updatedNotes.find(note => note.id === id)
  }, [notes, saveToStorage])

  // Obtener notas activas
  const getActiveNotes = useCallback(() => {
    return notes.filter(note => !note.isArchived)
  }, [notes])

  // Obtener notas archivadas
  const getArchivedNotes = useCallback(() => {
    return notes.filter(note => note.isArchived)
  }, [notes])

  // Buscar notas
  const searchNotes = useCallback(async (query: string) => {
    const searchTerm = query.toLowerCase()
    return notes.filter(note => 
      note.title.toLowerCase().includes(searchTerm) ||
      note.content.toLowerCase().includes(searchTerm)
    )
  }, [notes])

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    toggleArchive,
    getActiveNotes,
    getArchivedNotes,
    searchNotes
  }
} 