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
  onShowBugReport?: () => void
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
  onShowBugReport,
  onToggleReadingMode,
  readingMode,
  fileName,
  onFileNameChange,
}) => {
  const { isDarkMode, viewMode, accentPreset, setAccentPreset, customAccentHex, setCustomAccentHex } = useStore()
  const fileNameRef = useRef<HTMLDivElement>(null)
  const [fileMenuOpen, setFileMenuOpen] = useState(false)
  const fileMenuRef = useRef<HTMLDivElement>(null)
  const [accentMenuOpen, setAccentMenuOpen] = useState(false)
  const accentMenuRef = useRef<HTMLDivElement>(null)
  const [customHexInput, setCustomHexInput] = useState(customAccentHex)

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
    if (!fileMenuOpen && !accentMenuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (fileMenuOpen && fileMenuRef.current && !fileMenuRef.current.contains(e.target as Node)) {
        setFileMenuOpen(false)
      }
      if (accentMenuOpen && accentMenuRef.current && !accentMenuRef.current.contains(e.target as Node)) {
        setAccentMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [fileMenuOpen, accentMenuOpen])

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

        {/* Accent color picker (dark mode only) — single swatch + dropdown */}
        {isDarkMode && (
          <div ref={accentMenuRef} style={{ position: 'relative' }}>
            <button
              className="accent-swatch-btn"
              onClick={() => setAccentMenuOpen(!accentMenuOpen)}
              title="Accent color"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'var(--surface2)', border: '1px solid var(--border)',
                padding: '4px 8px', borderRadius: '6px', cursor: 'pointer',
                fontSize: '13px', color: 'var(--text)',
              }}
            >
              <span style={{
                width: 14, height: 14, borderRadius: '50%',
                background: ACCENT_PRESETS[accentPreset].accent,
                border: '2px solid var(--text)', flexShrink: 0,
              }} />
              <span style={{ fontSize: '11px' }}>▾</span>
            </button>
            {accentMenuOpen && (
              <div style={{
                position: 'fixed',
                top: accentMenuRef.current
                  ? accentMenuRef.current.getBoundingClientRect().bottom + 4
                  : 40,
                right: Math.max(8, window.innerWidth - (accentMenuRef.current
                  ? accentMenuRef.current.getBoundingClientRect().right
                  : window.innerWidth)),
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '8px', zIndex: 9999,
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)', padding: '8px',
                minWidth: '180px',
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', padding: '4px 6px', marginBottom: '4px', fontWeight: 600 }}>
                  Accent Color
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '4px 6px' }}>
                  {(Object.keys(ACCENT_PRESETS) as AccentPreset[]).filter(p => p !== 'custom').map((preset) => (
                    <button
                      key={preset}
                      onClick={() => { setAccentPreset(preset); setAccentMenuOpen(false) }}
                      title={preset.charAt(0).toUpperCase() + preset.slice(1)}
                      style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: ACCENT_PRESETS[preset].accent,
                        border: preset === accentPreset ? '2px solid var(--text)' : '2px solid transparent',
                        cursor: 'pointer', padding: 0,
                        boxShadow: preset === accentPreset ? '0 0 0 2px var(--bg)' : 'none',
                        transition: 'all 0.15s',
                      }}
                    />
                  ))}
                </div>
                <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />
                <div style={{ padding: '4px 6px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 600 }}>
                    Custom HEX
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={customHexInput}
                      onChange={(e) => setCustomHexInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const hex = customHexInput.trim()
                          if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
                            setCustomAccentHex(hex)
                            setAccentMenuOpen(false)
                          }
                        }
                      }}
                      placeholder="#ff5500"
                      maxLength={7}
                      style={{
                        flex: 1, padding: '5px 8px',
                        background: 'var(--surface2)', border: '1px solid var(--border)',
                        borderRadius: '4px', color: 'var(--text)',
                        fontSize: '13px', fontFamily: 'SF Mono, monospace',
                        outline: 'none', minWidth: 0,
                      }}
                    />
                    <button
                      onClick={() => {
                        const hex = customHexInput.trim()
                        if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
                          setCustomAccentHex(hex)
                          setAccentMenuOpen(false)
                        }
                      }}
                      style={{
                        padding: '5px 10px', background: 'var(--accent)',
                        color: 'var(--accent-text)', border: 'none',
                        borderRadius: '4px', cursor: 'pointer',
                        fontSize: '12px', fontWeight: 600,
                      }}
                    >
                      Apply
                    </button>
                  </div>
                  {accentPreset === 'custom' && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      marginTop: '6px', fontSize: '11px', color: 'var(--text-dim)',
                    }}>
                      <span style={{
                        width: 12, height: 12, borderRadius: '50%',
                        background: ACCENT_PRESETS.custom.accent,
                        border: '1px solid var(--border)',
                      }} />
                      Active: {customAccentHex}
                    </div>
                  )}
                </div>
              </div>
            )}
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
        <button onClick={onShowBugReport} className="icon-btn" title="Report a bug">🐛</button>
      </div>
    </div>
  )
}
