import React, { useRef, useEffect } from 'react'
import { useStore } from '../store'

interface EditorProps {
  onContentChange: (content: string) => void
}

export const Editor: React.FC<EditorProps> = ({ onContentChange }) => {
  const { content, setContent } = useStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.currentTarget.value
    setContent(newContent)
    onContentChange(newContent)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      const newContent = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end)
      setContent(newContent)
      onContentChange(newContent)

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = content
    }
  }, [content])

  return (
    <textarea
      ref={textareaRef}
      className="editor"
      placeholder="Type or paste Markdown here..."
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      value={content}
      spellCheck="false"
    />
  )
}
