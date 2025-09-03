import { useAuth } from '../hooks/useAuth'
import { AnimatedButton } from './ui/AnimatedButton'
import { LogOut, User, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export const Auth = () => {
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <div 
          className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 px-3 py-1 h-8 cursor-pointer hover:bg-gray-700/50 transition-all duration-200"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className="text-sm text-gray-300 font-medium truncate max-w-32">
            {user.user_metadata?.full_name || user.email}
          </span>
          {user.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt={user.user_metadata?.full_name || user.email}
              className="w-6 h-6 rounded-full border border-gray-600 flex-shrink-0"
            />
          ) : (
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-3 h-3 text-white" />
            </div>
          )}
          <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 flex-shrink-0 ${showDropdown ? 'rotate-180' : ''}`} />
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div 
            className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-50 min-w-32"
          >
            <div className="px-3 py-2 border-b border-gray-700">
              <p className="text-xs text-gray-300 font-medium">
                {user.user_metadata?.full_name || user.email}
              </p>
              <p className="text-xs text-gray-500">
                {user.email}
              </p>
            </div>
            <button
              onClick={signOut}
              className="w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-gray-700 flex items-center gap-2 transition-colors duration-200"
            >
              <LogOut className="w-3 h-3" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <AnimatedButton
        onClick={signInWithGoogle}
        className="bg-gray-800 hover:bg-gray-700 text-white w-8 h-8 rounded-md border border-gray-600 transition-all duration-200 hover:border-gray-500 hover:shadow-lg flex items-center justify-center"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      </AnimatedButton>
    </div>
  )
} 