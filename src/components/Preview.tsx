import React, { useEffect, useRef } from 'react'
import { useMarkdown } from '../hooks/useMarkdown'
import { useStore } from '../store'

interface PreviewProps {
  onHeadingsChange: (headings: Array<{ level: number; text: string; id: string }>) => void
}

export const Preview: React.FC<PreviewProps> = ({ onHeadingsChange }) => {
  const { content, isDarkMode } = useStore()
  const { html, headings } = useMarkdown(content, isDarkMode)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onHeadingsChange(headings)
  }, [headings, onHeadingsChange])

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
