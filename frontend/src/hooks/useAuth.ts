import { useState, useEffect, useCallback } from 'react'
import { supabase, type User, type AuthState } from '../lib/supabase'

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true
  })

  // Verificar sesión actual
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setAuthState({ user: null, loading: false })
          return
        }

        if (session?.user) {
          setAuthState({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              user_metadata: session.user.user_metadata
            },
            loading: false
          })
        } else {
          setAuthState({ user: null, loading: false })
        }
      } catch (error) {
        console.error('Error in getSession:', error)
        setAuthState({ user: null, loading: false })
      }
    }

    getSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
      // removed debug log
        
        if (session?.user) {
          setAuthState({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              user_metadata: session.user.user_metadata
            },
            loading: false
          })
        } else {
          setAuthState({ user: null, loading: false })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Login con Google
  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account' // FORZAR SELECCIÓN DE CUENTA
          }
        }
      })

      if (error) {
        console.error('Error signing in with Google:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in signInWithGoogle:', error)
      throw error
    }
  }, [])

  // Logout
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error signing out:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in signOut:', error)
      throw error
    }
  }, [])

  return {
    user: authState.user,
    loading: authState.loading,
    signInWithGoogle,
    signOut
  }
} 