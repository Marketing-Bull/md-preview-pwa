import { useEffect } from 'react'

interface Shortcuts {
  openFile: () => void
  saveFile: () => void
  toggleTheme: () => void
  toggleFindBar: () => void
  exportPDF: () => void
  cycleViewMode: () => void
  closeModal: () => void
}

export const useKeyboardShortcuts = (shortcuts: Shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey

      if (isCmdOrCtrl && e.key === 'f') {
        e.preventDefault()
        shortcuts.toggleFindBar()
      }

      if (isCmdOrCtrl && e.key === 'd') {
        e.preventDefault()
        shortcuts.toggleTheme()
      }

      if (isCmdOrCtrl && e.key === 's') {
        e.preventDefault()
        shortcuts.saveFile()
      }

      if (isCmdOrCtrl && e.key === 'o') {
        e.preventDefault()
        shortcuts.openFile()
      }

      if (isCmdOrCtrl && e.key === 'p') {
        e.preventDefault()
        shortcuts.exportPDF()
      }

      if (isCmdOrCtrl && e.key === 'e') {
        e.preventDefault()
        shortcuts.cycleViewMode()
      }

      if (isCmdOrCtrl && e.key === 'b') {
        e.preventDefault()
        const el = document.querySelector('textarea') as HTMLTextAreaElement
        if (el) wrapSelection(el, '**', '**')
      }

      if (isCmdOrCtrl && e.key === 'i') {
        e.preventDefault()
        const el = document.querySelector('textarea') as HTMLTextAreaElement
        if (el) wrapSelection(el, '*', '*')
      }

      if (e.key === 'Escape') {
        shortcuts.closeModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

export const wrapSelection = (textarea: HTMLTextAreaElement, before: string, after: string) => {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)
  const newText = before + selectedText + after

  textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end)
  textarea.focus()
  textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)

  // Trigger input event to update store
  textarea.dispatchEvent(new Event('input', { bubbles: true }))
}
