import React, { useEffect, useRef, useMemo } from 'react'
import { useMarkdown } from '../hooks/useMarkdown'
import { useJsonValidator } from '../hooks/useJsonValidator'
import { useStore } from '../store'
import { JsonPreview } from './JsonPreview'

const isHtmlFile = (name: string): boolean => {
  const lower = name.toLowerCase()
  return lower.endsWith('.html') || lower.endsWith('.htm')
}

export const Preview: React.FC = () => {
  const { content, isDarkMode, fileName } = useStore()
  const isHtml = useMemo(() => isHtmlFile(fileName), [fileName])
  const { html } = useMarkdown(isHtml ? '' : content, isDarkMode)
  const jsonResult = useJsonValidator(isHtml ? '' : content)
  const markdownDivRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Render markdown HTML into the inner div (only when not in JSON or HTML mode)
  useEffect(() => {
    if (!markdownDivRef.current) return
    markdownDivRef.current.innerHTML = jsonResult.isJson || isHtml ? '' : html
  }, [html, jsonResult.isJson, isHtml])

  // Copy button event delegation for code blocks
  useEffect(() => {
    const el = markdownDivRef.current
    if (!el) return
    const handleClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copy-code]')
      if (!btn) return
      const code = btn.closest('pre')?.querySelector('code')
      if (code?.textContent) {
        navigator.clipboard.writeText(code.textContent).then(() => {
          btn.textContent = 'Copied!'
          setTimeout(() => { btn.textContent = 'Copy' }, 1500)
        }).catch(() => {})
      }
    }
    el.addEventListener('click', handleClick)
    return () => el.removeEventListener('click', handleClick)
  }, [])

  // Scroll sync: editor ↔ preview (proportional)
  // Uses a timer to hold the sync-lock long enough for the browser to fire
  // the programmatic scroll event on the target pane before we unlock,
  // preventing an infinite feedback loop.
  useEffect(() => {
    const editor = document.querySelector<HTMLTextAreaElement>('textarea.editor')
    const preview = scrollRef.current
    if (!editor || !preview) return

    let syncingFromEditor = 0
    let syncingFromPreview = 0

    const onEditorScroll = () => {
      if (syncingFromPreview) return
      const maxScroll = editor.scrollHeight - editor.clientHeight
      if (maxScroll <= 0) return
      const ratio = editor.scrollTop / maxScroll
      clearTimeout(syncingFromEditor)
      syncingFromEditor = window.setTimeout(() => { syncingFromEditor = 0 }, 80)
      preview.scrollTop = ratio * Math.max(0, preview.scrollHeight - preview.clientHeight)
    }

    const onPreviewScroll = () => {
      if (syncingFromEditor) return
      const maxScroll = preview.scrollHeight - preview.clientHeight
      if (maxScroll <= 0) return
      const ratio = preview.scrollTop / maxScroll
      clearTimeout(syncingFromPreview)
      syncingFromPreview = window.setTimeout(() => { syncingFromPreview = 0 }, 80)
      editor.scrollTop = ratio * Math.max(0, editor.scrollHeight - editor.clientHeight)
    }

    editor.addEventListener('scroll', onEditorScroll, { passive: true })
    preview.addEventListener('scroll', onPreviewScroll, { passive: true })
    return () => {
      editor.removeEventListener('scroll', onEditorScroll)
      preview.removeEventListener('scroll', onPreviewScroll)
      clearTimeout(syncingFromEditor)
      clearTimeout(syncingFromPreview)
    }
  }, [])

  // HTML file preview
  if (isHtml) {
    return (
      <div ref={scrollRef} className="preview-scroll-container">
        <iframe
          srcDoc={content}
          className="html-preview-frame"
          sandbox="allow-scripts allow-same-origin"
          title="HTML Preview"
        />
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="preview-scroll-container">
      {jsonResult.isJson ? (
        <div className="preview-content json-mode">
          <JsonPreview result={jsonResult} rawContent={content} />
        </div>
      ) : (
        <div ref={markdownDivRef} className="preview-content" />
      )}
    </div>
  )
}
