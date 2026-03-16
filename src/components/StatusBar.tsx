import React, { useMemo } from 'react'
import { useStore } from '../store'

export const StatusBar: React.FC = () => {
  const { content, lastSaved } = useStore()

  const stats = useMemo(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0
    const chars = content.length
    const lines = content.split('\n').length

    // Calculate reading time (average 200 words per minute)
    const readingTimeMinutes = Math.ceil(words / 200)
    const readingTime = readingTimeMinutes === 0 ? '< 1 min' : `${readingTimeMinutes} min`

    return { words, chars, lines, readingTime }
  }, [content])

  return (
    <div className="status-bar">
      <span id="stats">
        {stats.words} words · {stats.chars} chars · {stats.lines} lines
      </span>
      <span className="spacer"></span>
      <span>📖 {stats.readingTime} read</span>
      <span>·</span>
      {lastSaved && <span style={{ opacity: 0.6 }}>💾 saved</span>}
      {lastSaved && <span>·</span>}
      <span>Markdown + Mermaid + Syntax Highlighting</span>
      <a
        href="https://getmarketingbull.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-brand-link"
        title="Marketing Bull"
      >
        <img src="/mb-logo.png" alt="Marketing Bull" className="mb-brand-logo" />
      </a>
    </div>
  )
}
