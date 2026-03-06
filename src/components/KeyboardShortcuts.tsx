import React from 'react'

interface KeyboardShortcutsProps {
  visible: boolean
  onClose: () => void
}

const shortcuts = [
  { desc: 'Toggle Dark/Light Mode', key: 'Cmd+D' },
  { desc: 'Save file', key: 'Cmd+S' },
  { desc: 'Open file', key: 'Cmd+O' },
  { desc: 'Export PDF', key: 'Cmd+P' },
  { desc: 'Cycle view modes', key: 'Cmd+E' },
  { desc: 'Bold text', key: 'Cmd+B' },
  { desc: 'Italic text', key: 'Cmd+I' },
  { desc: 'Find & Replace', key: 'Cmd+F' },
  { desc: 'Close overlay', key: 'Escape' },
]

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ visible, onClose }) => {
  return (
    <div className={`shortcuts-overlay ${visible ? 'visible' : ''}`} onClick={onClose}>
      <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <h3>⌨️ Keyboard Shortcuts</h3>
        <div className="shortcuts-list">
          {shortcuts.map((shortcut, idx) => (
            <div key={idx} className="shortcut-item">
              <span className="shortcut-desc">{shortcut.desc}</span>
              <span className="shortcut-key">{shortcut.key}</span>
            </div>
          ))}
        </div>
        <button className="shortcuts-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
