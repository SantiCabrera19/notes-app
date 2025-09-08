import React, { useEffect, useRef, useState } from 'react'

interface ConfirmDialogProps {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  requireTextMatch?: string // si se provee, el usuario debe escribir este texto para confirmar
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  requireTextMatch,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isOpen && requireTextMatch) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else if (!isOpen) {
      setInput('')
    }
  }, [isOpen, requireTextMatch])

  if (!isOpen) return null

  const canConfirm = requireTextMatch ? input.trim() === requireTextMatch.trim() : true

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h3 className={`text-lg font-semibold ${danger ? 'text-red-400' : 'text-white'}`}>{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-gray-300">{description}</p>
        )}

        {requireTextMatch && (
          <div className="mt-4">
            <label className="block text-sm text-gray-400 mb-1">
              Escribe exactamente: <span className="text-red-400 font-mono">{requireTextMatch}</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={requireTextMatch}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="mt-1 text-xs text-gray-500">Esta acción es irreversible.</p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={!canConfirm}
            className={`px-4 py-2 rounded-lg border ${danger ? 'bg-red-600 hover:bg-red-700 border-red-700 text-white disabled:opacity-60' : 'bg-blue-600 hover:bg-blue-700 border-blue-700 text-white disabled:opacity-60'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

