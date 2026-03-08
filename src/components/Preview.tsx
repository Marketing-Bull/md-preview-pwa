import React, { useEffect, useRef } from 'react'
import { useMarkdown } from '../hooks/useMarkdown'
import { useStore } from '../store'

export const Preview: React.FC = () => {
  const { content, isDarkMode } = useStore()
  const { html } = useMarkdown(content, isDarkMode)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML = html
    }
  }, [html])

  return (
    <div className="preview-pane">
      <div
        ref={previewRef}
        className="preview-content"
      />
    </div>
  )
}
