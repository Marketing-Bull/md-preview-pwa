import React, { useState, useRef, useEffect } from 'react'
import { useStore } from '../store'

export const TabBar: React.FC = () => {
  const { files, activeFileId, setActiveFile, addFile, deleteFile, updateFile } = useStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingId])

  const handleNewFile = () => {
    addFile('untitled.md')
  }

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (Object.keys(files).length > 1) {
      deleteFile(id)
    }
  }

  const startRename = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(id)
    setEditValue(currentName)
  }

  const commitRename = () => {
    if (editingId) {
      const name = editValue.trim() || files[editingId]?.name || 'untitled.md'
      const finalName = name.endsWith('.md') ? name : `${name}.md`
      updateFile(editingId, finalName)
    }
    setEditingId(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitRename()
    if (e.key === 'Escape') setEditingId(null)
  }

  return (
    <div className="tab-bar">
      <div className="tabs">
        {Object.values(files).map((file) => (
          <div
            key={file.id}
            className={`tab ${file.id === activeFileId ? 'active' : ''}`}
            onClick={() => setActiveFile(file.id)}
            title={file.name}
          >
            {editingId === file.id ? (
              <input
                ref={inputRef}
                className="tab-rename-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitRename}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className="tab-name"
                onDoubleClick={(e) => startRename(file.id, file.name, e)}
              >
                {file.name}
              </span>
            )}
            {Object.keys(files).length > 1 && (
              <button
                className="tab-close"
                onClick={(e) => handleCloseTab(file.id, e)}
                title="Close file"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <button className="tab-new" onClick={handleNewFile} title="New file (Cmd+T)">
        +
      </button>
    </div>
  )
}
