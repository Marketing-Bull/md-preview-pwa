import React, { useState, useRef, useEffect } from 'react'
import { useStore, HighlightTheme } from '../store'

const THEMES: Array<{ value: HighlightTheme; label: string }> = [
  { value: 'github', label: 'GitHub Light' },
  { value: 'github-dark', label: 'GitHub Dark' },
  { value: 'monokai', label: 'Monokai' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'solarized-dark', label: 'Solarized Dark' },
  { value: 'atom-one-dark', label: 'Atom One Dark' },
  { value: 'vs-light', label: 'Visual Studio Light' },
]

export const SyntaxThemePicker: React.FC = () => {
  const { highlightTheme, setHighlightTheme } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const currentLabel = THEMES.find((t) => t.value === highlightTheme)?.label || 'Theme'

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  const handleSelectTheme = (theme: HighlightTheme) => {
    setHighlightTheme(theme)
    setIsOpen(false)
  }

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Syntax highlight theme"
        style={{ whiteSpace: 'nowrap' }}
      >
        🎨 {currentLabel}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            minWidth: '200px',
            zIndex: 1000,
            marginTop: '4px',
          }}
        >
          {THEMES.map((theme) => (
            <button
              key={theme.value}
              onClick={() => handleSelectTheme(theme.value)}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 12px',
                background: highlightTheme === theme.value ? 'var(--surface2)' : 'transparent',
                border: 'none',
                textAlign: 'left',
                fontSize: '13px',
                color: 'var(--text)',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = 'var(--surface2)'
              }}
              onMouseLeave={(e) => {
                if (highlightTheme !== theme.value) {
                  ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                }
              }}
            >
              {theme.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
