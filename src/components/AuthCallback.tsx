import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle } from 'lucide-react'

export const AuthCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error in auth callback:', error)
          setStatus('error')
          setMessage('Error al autenticar. Intenta de nuevo.')
          setTimeout(() => navigate('/'), 3000)
          return
        }

        if (data.session) {
          setStatus('success')
          setMessage('¡Autenticación exitosa! Redirigiendo...')
          setTimeout(() => navigate('/'), 2000)
        } else {
          setStatus('error')
          setMessage('No se pudo completar la autenticación.')
          setTimeout(() => navigate('/'), 3000)
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        setStatus('error')
        setMessage('Error inesperado. Intenta de nuevo.')
        setTimeout(() => navigate('/'), 3000)
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <motion.div
        className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 max-w-md w-full mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center space-y-4">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white text-lg font-medium">Procesando autenticación...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <CheckCircle className="w-12 h-12 text-green-400" />
              </motion.div>
              <p className="text-white text-lg font-medium">{message}</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <AlertCircle className="w-12 h-12 text-red-400" />
              </motion.div>
              <p className="text-white text-lg font-medium">{message}</p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
} 