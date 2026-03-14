import React from 'react'
import { useStore } from '../store'

export const MobileTabBar: React.FC = () => {
  const { viewMode, setViewMode } = useStore()

  const tabs = [
    { mode: 'editor' as const, label: 'Editor', icon: '📝' },
    { mode: 'split' as const, label: 'Split', icon: '⊞' },
    { mode: 'preview' as const, label: 'Preview', icon: '👁️' },
  ]

  return (
    <div className="mobile-tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.mode}
          className={`tab-button ${viewMode === tab.mode ? 'active' : ''}`}
          onClick={() => setViewMode(tab.mode)}
          title={tab.label}
        >
          <span style={{ fontSize: '20px' }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
