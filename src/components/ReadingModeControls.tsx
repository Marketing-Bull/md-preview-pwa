import React from 'react'
import { useStore } from '../store'

export const ReadingModeControls: React.FC = () => {
  const { fontSize, setFontSize, lineHeight, setLineHeight, sepia, setSepia, headingSpacing, setHeadingSpacing } = useStore()

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '12px 16px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Font Size:</label>
        <input
          type="range"
          min="12"
          max="24"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          style={{ width: '100px' }}
        />
        <span style={{ fontSize: '12px', color: 'var(--text-dim)', minWidth: '30px' }}>
          {fontSize}px
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Line Height:</label>
        <input
          type="range"
          min="1.2"
          max="2"
          step="0.1"
          value={lineHeight}
          onChange={(e) => setLineHeight(parseFloat(e.target.value))}
          style={{ width: '100px' }}
        />
        <span style={{ fontSize: '12px', color: 'var(--text-dim)', minWidth: '35px' }}>
          {lineHeight.toFixed(1)}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Heading Spacing:</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={headingSpacing}
          onChange={(e) => setHeadingSpacing(parseFloat(e.target.value))}
          style={{ width: '100px' }}
        />
        <span style={{ fontSize: '12px', color: 'var(--text-dim)', minWidth: '30px' }}>
          {headingSpacing.toFixed(1)}x
        </span>
      </div>

      <button
        onClick={() => setSepia(!sepia)}
        style={{
          background: sepia ? 'var(--accent)' : 'var(--surface2)',
          color: sepia ? '#000' : 'var(--text)',
          border: '1px solid var(--border)',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {sepia ? '🟡 Sepia On' : '⚪ Sepia Off'}
      </button>
    </div>
  )
}
