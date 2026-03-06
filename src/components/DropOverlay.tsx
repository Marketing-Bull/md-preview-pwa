import React from 'react'

interface DropOverlayProps {
  visible: boolean
}

export const DropOverlay: React.FC<DropOverlayProps> = ({ visible }) => {
  return (
    <div className={`drop-overlay ${visible ? 'visible' : ''}`}>
      <div className="drop-overlay-content">
        <div className="drop-icon">📄</div>
        <div className="drop-text">Drop markdown file here</div>
      </div>
    </div>
  )
}
