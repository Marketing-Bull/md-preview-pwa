import React from 'react'
import { useStore } from '../store'

export const TabBar: React.FC = () => {
  const { files, activeFileId, setActiveFile, addFile, deleteFile } = useStore()

  const handleNewFile = () => {
    addFile('untitled.md')
  }

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (Object.keys(files).length > 1) {
      deleteFile(id)
    }
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
            <span className="tab-name">{file.name}</span>
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
