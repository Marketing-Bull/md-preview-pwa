import React from 'react'

interface KeyboardShortcutsProps {
  visible: boolean
  onClose: () => void
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPad|iPhone/.test(navigator.userAgent)
const mod = isMac ? '⌘' : 'Ctrl+'

const shortcuts = [
  { desc: 'Open this menu', key: '?' },
  { desc: 'Find & Replace', key: `${mod}F` },
  { desc: 'Bold', key: `${mod}B` },
  { desc: 'Italic', key: `${mod}I` },
  { desc: 'Toggle Dark/Light Mode', key: `${mod}D` },
  { desc: 'Save (Save As)', key: `${mod}S` },
  { desc: 'Share as URL', key: `⇧${mod}S` },
  { desc: 'Open file', key: `${mod}O` },
  { desc: 'New tab', key: `${mod}T` },
  { desc: 'Export PDF', key: `${mod}P` },
  { desc: 'Export HTML', key: `⇧${mod}H` },
  { desc: 'Cycle view modes', key: `${mod}E` },
  { desc: 'Toggle Reading Mode', key: `${mod}R` },
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
