import React, { useState, useRef, useEffect } from 'react'
import { getRecentFiles, openFile } from '../utils/fileOperations'

interface RecentFilesProps {
  onSelect: (content: string, fileName: string) => void
}

export const RecentFiles: React.FC<RecentFilesProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [recent, setRecent] = useState<Array<{ name: string; timestamp: number }>>([])
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setRecent(getRecentFiles())
    }
  }, [isOpen])

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

  const handleSelectRecent = async () => {
    const result = await openFile()
    if (result) {
      onSelect(result.content, result.fileName)
      setIsOpen(false)
    }
  }

  return (
    <div ref={menuRef} className="recent-files-menu" style={{ position: 'relative' }}>
      <button
        className="recent-files-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Recent files"
      >
        📂
      </button>

      {isOpen && (
        <div
          className="recent-files-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            minWidth: '220px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000,
            marginTop: '4px',
          }}
        >
          {recent.length === 0 ? (
            <div style={{ padding: '12px', color: 'var(--text-dim)', fontSize: '12px' }}>
              No recent files
            </div>
          ) : (
            <>
              <div style={{ padding: '8px 12px', color: 'var(--text-dim)', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>
                Recently opened:
              </div>
              {recent.map((file) => (
                <div
                  key={file.timestamp}
                  style={{
                    padding: '8px 12px',
                    background: 'transparent',
                    borderBottom: '1px solid var(--border)',
                    fontSize: '13px',
                    color: 'var(--text-dim)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={file.name}
                >
                  {file.name}
                </div>
              ))}
              <button
                onClick={handleSelectRecent}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent)',
                  textAlign: 'left',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.background = 'var(--surface2)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                + Open file...
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
