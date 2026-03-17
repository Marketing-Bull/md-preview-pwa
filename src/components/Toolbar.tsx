import React, { useRef, useState, useEffect } from 'react'
import { useStore, ACCENT_PRESETS, type AccentPreset } from '../store'

interface ToolbarProps {
  onNew: () => void
  onNewHtml: () => void
  onOpen: () => void
  onSave: () => void
  onSaveAs: () => void
  onCloseAll: () => void
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
  onNewHtml,
  onOpen,
  onSave,
  onSaveAs,
  onCloseAll,
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
  const { isDarkMode, viewMode, accentPreset, setAccentPreset } = useStore()
  const fileNameRef = useRef<HTMLDivElement>(null)
  const [fileMenuOpen, setFileMenuOpen] = useState(false)
  const fileMenuRef = useRef<HTMLDivElement>(null)

  const handleFileNameBlur = () => {
    let name = fileNameRef.current?.textContent?.trim() || 'untitled.md'
    if (!name) name = 'untitled.md'
    const hasExt = /\.(md|markdown|html|htm|txt)$/i.test(name)
    if (!hasExt) name += '.md'
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
    if (!fileMenuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(e.target as Node)) {
        setFileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [fileMenuOpen])

  const viewLabel = viewMode === 'split' ? '⬛ Split' : viewMode === 'editor' ? '✏️ Editor' : '👁 Preview'

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)
  const mod = isMac ? '⌘' : 'Ctrl+'

  const menuItem = (label: string, action: () => void, shortcut?: string) => (
    <button
      key={label}
      onClick={() => { action(); setFileMenuOpen(false) }}
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        width: '100%', padding: '9px 14px',
        background: 'transparent', border: 'none', textAlign: 'left',
        fontSize: '13px', color: 'var(--text)', cursor: 'pointer',
        transition: 'background 0.15s', whiteSpace: 'nowrap', gap: '24px',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface2)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <span>{label}</span>
      {shortcut && <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'SF Mono, monospace' }}>{shortcut}</span>}
    </button>
  )

  const menuDivider = () => (
    <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
  )

  return (
    <div className="toolbar">
      {/* Left: brand + File menu + quick save */}
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
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)', minWidth: '220px',
            }}>
              {menuItem('New Markdown', onNew, `${mod}T`)}
              {menuItem('New HTML', onNewHtml)}
              {menuItem('Open...', onOpen, `${mod}O`)}
              {menuDivider()}
              {menuItem('Save', onSave, `${mod}S`)}
              {menuItem('Save As...', onSaveAs, `⇧${mod}S`)}
              {menuDivider()}
              {menuItem('Export PDF', onExportPDF, `${mod}P`)}
              {menuItem('Export HTML', onExportHTML)}
              {menuItem('Share as URL', onShare)}
              {menuDivider()}
              {menuItem('Close All Tabs', onCloseAll)}
            </div>
          )}
        </div>

        <button onClick={onSave} className="icon-btn" title={`Save (${mod}S)`}>💾</button>
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

      {/* Right: view | find | accent | settings */}
      <div className="toolbar-right">
        <button
          onClick={toggleTheme}
          className="icon-btn"
          title={isDarkMode ? `Light mode (${mod}D)` : `Dark mode (${mod}D)`}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* Accent color picker (dark mode only) */}
        {isDarkMode && (
          <div className="accent-picker" title="Accent color">
            {(Object.keys(ACCENT_PRESETS) as AccentPreset[]).map((preset) => (
              <button
                key={preset}
                className={`accent-swatch ${preset === accentPreset ? 'active' : ''}`}
                style={{ background: ACCENT_PRESETS[preset].accent }}
                onClick={() => setAccentPreset(preset)}
                title={preset.charAt(0).toUpperCase() + preset.slice(1)}
              />
            ))}
          </div>
        )}

        <button onClick={cycleViewMode} title="Cycle view: Split / Editor / Preview">
          {viewLabel}
        </button>
        <button
          onClick={onToggleReadingMode}
          title={`Reading mode (${mod}R)`}
          style={{ color: readingMode ? 'var(--accent)' : 'inherit' }}
        >
          📖 Read
        </button>
        <button onClick={onShowFind} className="primary" title={`Find & Replace (${mod}F)`}>
          🔍 Find
        </button>

        <div className="toolbar-separator" />

        <button onClick={onShowInstallGuide} className="icon-btn" title="Install app to Home Screen / Dock">📲</button>
        <button onClick={onShowShortcuts} className="icon-btn" title="Keyboard shortcuts (?)">⌨️</button>
      </div>
    </div>
  )
}
