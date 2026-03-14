import React, { useRef } from 'react'
import { useStore } from '../store'
import { RecentFiles } from './RecentFiles'
import { SyntaxThemePicker } from './SyntaxThemePicker'

interface ToolbarProps {
  onOpen: () => void
  onSave: () => void
  onExportHTML: () => void
  onShowFind?: () => void
  onShowShortcuts?: () => void
  onExportPDF?: () => void
  onToggleReadingMode?: () => void
  readingMode?: boolean
  fileName: string
  onFileNameChange: (name: string) => void
  onLoadFile?: (content: string, fileName: string) => void
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onOpen,
  onSave,
  onExportHTML,
  onShowFind,
  onShowShortcuts,
  onExportPDF,
  onToggleReadingMode,
  readingMode,
  fileName,
  onFileNameChange,
  onLoadFile,
}) => {
  const { isDarkMode } = useStore()
  const fileNameRef = useRef<HTMLDivElement>(null)

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
    useStore.setState((state) => ({ isDarkMode: !state.isDarkMode }))
  }

  return (
    <div className="toolbar">
      <span className="logo">⚡ MD Preview</span>
      <button onClick={onOpen} title="Open .md file (Cmd+O)">
        📂 Open
      </button>
      {onLoadFile && <RecentFiles onSelect={onLoadFile} />}
      <button onClick={onSave} title="Save as .md (Cmd+S)">
        💾 Save
      </button>
      <div className="spacer"></div>
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
      <div className="spacer"></div>
      <button onClick={toggleTheme} title={isDarkMode ? 'Switch to Light Mode (Cmd+D)' : 'Switch to Dark Mode (Cmd+D)'}>
        {isDarkMode ? '🌙' : '☀️'}
      </button>
      <SyntaxThemePicker />
      <button
        onClick={onToggleReadingMode}
        title="Reading Mode"
        style={{ color: readingMode ? 'var(--accent)' : 'inherit' }}
      >
        📖
      </button>
      <button onClick={onShowFind} className="primary" title="Find & Replace (Cmd+F)">
        🔍 Find
      </button>
      <button onClick={onShowShortcuts} title="Keyboard Shortcuts">
        ⌨️
      </button>
      <button onClick={onExportPDF} className="primary" title="Export PDF (Cmd+P)">
        📄 PDF
      </button>
      <button onClick={onExportHTML} title="Export HTML">
        🌐 HTML
      </button>
    </div>
  )
}
