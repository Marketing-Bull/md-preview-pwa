import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useStore } from '../store'

interface ToolbarProps {
  onNew: () => void
  onOpen: () => void
  onSave: () => void
  onSaveAs: () => void
  onExportHTML: () => void
  onExportPDF: () => void
  onShare: () => void
  onShowFind?: () => void
  onShowShortcuts?: () => void
  onShowInstallGuide?: () => void
  onToggleReadingMode?: () => void
  readingMode?: boolean
  fileName: string
  onFileNameChange: (name: string) => void
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onNew,
  onOpen,
  onSave,
  onSaveAs,
  onExportHTML,
  onExportPDF,
  onShare,
  onShowFind,
  onShowShortcuts,
  onShowInstallGuide,
  onToggleReadingMode,
  readingMode,
  fileName,
  onFileNameChange,
}) => {
  const { isDarkMode, viewMode } = useStore()
  const fileNameRef = useRef<HTMLDivElement>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [fileMenuOpen, setFileMenuOpen] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)
  const fileMenuRef = useRef<HTMLDivElement>(null)

  const handleFileNameBlur = () => {
    let name = fileNameRef.current?.textContent?.trim() || 'untitled.md'
    if (!name) name = 'untitled.md'
    if (!name.endsWith('.md') && !name.endsWith('.markdown')) name += '.md'
    onFileNameChange(name)
  }

  const handleFileNameKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleFileNameBlur()
      fileNameRef.current?.blur()
    }
    if (e.key === 'Escape') {
      if (fileNameRef.current) fileNameRef.current.textContent = fileName
      fileNameRef.current?.blur()
    }
  }

  const toggleTheme = () => {
    useStore.setState((state) => {
      const newDark = !state.isDarkMode
      localStorage.setItem('md-preview-theme', newDark ? 'dark' : 'light')
      return { isDarkMode: newDark }
    })
  }

  const cycleViewMode = () => {
    const modes = ['split', 'editor', 'preview'] as const
    const next = modes[(modes.indexOf(viewMode) + 1) % modes.length]
    localStorage.setItem('md-preview-view-mode', next)
    useStore.setState({ viewMode: next })
  }

  useEffect(() => {
    if (!exportOpen && !fileMenuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (exportOpen && exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setExportOpen(false)
      }
      if (fileMenuOpen && fileMenuRef.current && !fileMenuRef.current.contains(e.target as Node)) {
        setFileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [exportOpen, fileMenuOpen])

  const viewLabel = viewMode === 'split' ? '⬛ Split' : viewMode === 'editor' ? '✏️ Editor' : '👁 Preview'

  const menuItem = useCallback((label: string, action: () => void, shortcut?: string) => (
    <button
      key={label}
      onClick={action}
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        width: '100%', padding: '9px 14px',
        background: 'transparent', border: 'none', textAlign: 'left',
        fontSize: '13px', color: 'var(--text)', cursor: 'pointer',
        transition: 'background 0.15s', whiteSpace: 'nowrap',
        gap: '24px',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface2)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <span>{label}</span>
      {shortcut && <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'SF Mono, monospace' }}>{shortcut}</span>}
    </button>
  ), [])

  const isMac = typeof navigator !== 'undefined' && /Mac|iPad|iPhone/.test(navigator.userAgent)
  const modKey = isMac ? '⌘' : 'Ctrl+'

  return (
    <div className="toolbar">
      {/* Left: brand + file menu + quick save */}
      <div className="toolbar-left">
        <span className="logo">🐂 MB Editor</span>

        {/* File dropdown menu */}
        <div ref={fileMenuRef} style={{ position: 'relative' }}>
          <button onClick={() => setFileMenuOpen(!fileMenuOpen)} title="File menu">
            File ▾
          </button>
          {fileMenuOpen && (
            <div style={{
              position: 'fixed',
              top: fileMenuRef.current
                ? fileMenuRef.current.getBoundingClientRect().bottom + 4
                : 40,
              left: fileMenuRef.current
                ? fileMenuRef.current.getBoundingClientRect().left
                : 0,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '6px', zIndex: 9999,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)', minWidth: '200px',
            }}>
              {menuItem('New File', () => { onNew(); setFileMenuOpen(false) }, `${modKey}T`)}
              {menuItem('Open...', () => { onOpen(); setFileMenuOpen(false) }, `${modKey}O`)}
              <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
              {menuItem('Save', () => { onSave(); setFileMenuOpen(false) }, `${modKey}S`)}
              {menuItem('Save As...', () => { onSaveAs(); setFileMenuOpen(false) }, `⇧${modKey}S`)}
              <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
              {menuItem('Export PDF', () => { onExportPDF(); setFileMenuOpen(false) }, `${modKey}P`)}
              {menuItem('Export HTML', () => { onExportHTML(); setFileMenuOpen(false) })}
              {menuItem('Share as URL', () => { onShare(); setFileMenuOpen(false) })}
            </div>
          )}
        </div>

        <button onClick={onSave} title={`Save (${modKey}S)`}>
          💾
        </button>
      </div>

      {/* Center: editable filename */}
      <div className="toolbar-center">
        <div
          ref={fileNameRef}
          className="file-name"
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={handleFileNameBlur}
          onKeyDown={handleFileNameKeyDown}
          title="Click to rename"
        >
          {fileName}
        </div>
      </div>

      {/* Right: view | find | export | settings */}
      <div className="toolbar-right">
        <button
          onClick={toggleTheme}
          className="icon-btn"
          title={isDarkMode ? 'Switch to light mode (Cmd+D)' : 'Switch to dark mode (Cmd+D)'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <button onClick={cycleViewMode} title="Cycle view: Split / Editor / Preview">
          {viewLabel}
        </button>
        <button
          onClick={onToggleReadingMode}
          title="Reading mode (Cmd+R)"
          style={{ color: readingMode ? 'var(--accent)' : 'inherit' }}
        >
          📖 Read
        </button>
        <button onClick={onShowFind} className="primary" title="Find & Replace (Cmd+F)">
          🔍 Find
        </button>

        <div className="toolbar-separator" />

        <button onClick={onShowInstallGuide} className="icon-btn" title="Install app to Home Screen / Dock">📲</button>
        <button onClick={onShowShortcuts} className="icon-btn" title="Keyboard shortcuts (?)">⌨️</button>
      </div>
    </div>
  )
}
