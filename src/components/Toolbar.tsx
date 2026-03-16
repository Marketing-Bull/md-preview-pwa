import React, { useRef, useState, useEffect } from 'react'
import { useStore } from '../store'

interface ToolbarProps {
  onNew: () => void
  onOpen: () => void
  onSave: () => void
  onExportHTML: () => void
  onExportPDF: () => void
  onShare: () => void
  onShowFind?: () => void
  onShowShortcuts?: () => void
  onToggleReadingMode?: () => void
  readingMode?: boolean
  fileName: string
  onFileNameChange: (name: string) => void
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onNew,
  onOpen,
  onSave,
  onExportHTML,
  onExportPDF,
  onShare,
  onShowFind,
  onShowShortcuts,
  onToggleReadingMode,
  readingMode,
  fileName,
  onFileNameChange,
}) => {
  const { isDarkMode, viewMode } = useStore()
  const fileNameRef = useRef<HTMLDivElement>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)

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
    if (!exportOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setExportOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [exportOpen])

  const viewLabel = viewMode === 'split' ? '⬛ Split' : viewMode === 'editor' ? '✏️ Editor' : '👁 Preview'

  const exportItem = (label: string, action: () => void, shortcut?: string) => (
    <button
      key={label}
      onClick={() => { action(); setExportOpen(false) }}
      title={shortcut}
      style={{
        display: 'block', width: '100%', padding: '9px 14px',
        background: 'transparent', border: 'none', textAlign: 'left',
        fontSize: '13px', color: 'var(--text)', cursor: 'pointer',
        transition: 'background 0.15s', whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface2)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {label}
    </button>
  )

  return (
    <div className="toolbar">
      {/* Left: brand + file operations */}
      <div className="toolbar-left">
        <span className="logo">🐂 MB Editor</span>
        <button onClick={onNew} title="New file (Cmd+T)">＋ New</button>
        <button onClick={onOpen} title="Open file (Cmd+O)">📂 Open</button>
        <button onClick={onSave} title="Save (Cmd+S)">💾 Save</button>
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

        {/* Export dropdown — uses fixed positioning to escape toolbar overflow */}
        <div ref={exportMenuRef} style={{ position: 'relative' }}>
          <button onClick={() => setExportOpen(!exportOpen)} title="Export / Share">
            ↗ Export ▾
          </button>
          {exportOpen && (
            <div style={{
              position: 'fixed',
              top: exportMenuRef.current
                ? exportMenuRef.current.getBoundingClientRect().bottom + 4
                : 40,
              right: exportMenuRef.current
                ? window.innerWidth - exportMenuRef.current.getBoundingClientRect().right
                : 0,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '6px', zIndex: 9999, marginTop: '0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)', minWidth: '180px',
            }}>
              {exportItem('📄 Export PDF', onExportPDF, 'Cmd+P')}
              {exportItem('🌐 Export HTML', onExportHTML, 'Cmd+Shift+H')}
              {exportItem('💾 Download Markdown', onSave, 'Cmd+S')}
              <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
              {exportItem('🔗 Share as URL', onShare, 'Cmd+Shift+S')}
            </div>
          )}
        </div>

        <div className="toolbar-separator" />

        <button onClick={onShowShortcuts} className="icon-btn" title="Keyboard shortcuts (?)">⌨️</button>
      </div>
    </div>
  )
}
