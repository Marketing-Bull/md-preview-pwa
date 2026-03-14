import React from 'react'

interface KeyboardShortcutsProps {
  visible: boolean
  onClose: () => void
}

const shortcuts = [
  { desc: 'Open this menu', key: '?' },
  { desc: 'Find & Replace', key: 'Cmd+F' },
  { desc: 'Toggle Dark/Light Mode', key: 'Cmd+D' },
  { desc: 'Save file', key: 'Cmd+S' },
  { desc: 'Open file', key: 'Cmd+O' },
  { desc: 'New file', key: 'Cmd+T' },
  { desc: 'Export PDF', key: 'Cmd+P' },
  { desc: 'Export HTML', key: 'Cmd+Shift+H' },
  { desc: 'Share as URL', key: 'Cmd+Shift+S' },
  { desc: 'Cycle view modes', key: 'Cmd+E' },
  { desc: 'Toggle Reading Mode', key: 'Cmd+R' },
  { desc: 'Close overlay', key: 'Escape' },
]

const gestures = [
  { desc: 'Swipe left/right', action: 'Switch between editor, split, and preview views' },
  { desc: 'Pinch to zoom', action: 'Zoom in/out the preview on iPad' },
  { desc: 'Two-finger tap', action: 'Double-tap area to focus (iPad)' },
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

        <h4 style={{ marginTop: '20px', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '13px' }}>📱 Touch Gestures (iPad)</h4>
        <div className="shortcuts-list">
          {gestures.map((gesture, idx) => (
            <div key={idx} className="shortcut-item">
              <span className="shortcut-desc">{gesture.desc}</span>
              <span className="shortcut-key" style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{gesture.action}</span>
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
