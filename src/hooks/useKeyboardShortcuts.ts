import { useEffect } from 'react'

interface Shortcuts {
  openFile: () => void
  saveFile: () => void
  saveFileAs: () => void
  toggleTheme: () => void
  toggleFindBar: () => void
  exportPDF: () => void
  exportHTML: () => void
  cycleViewMode: () => void
  share: () => void
  toggleReadingMode: () => void
  addTab: () => void
  toggleShortcuts: () => void
  closeModal: () => void
}

const isTypingTarget = (e: KeyboardEvent): boolean => {
  const target = e.target as HTMLElement
  const tag = target.tagName
  return tag === 'TEXTAREA' || tag === 'INPUT' || target.isContentEditable
}

export const useKeyboardShortcuts = (shortcuts: Shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey
      const typing = isTypingTarget(e)

      // Cmd/Ctrl shortcuts work everywhere (they don't conflict with typing)
      if (isCmdOrCtrl && e.key === 'f') { e.preventDefault(); shortcuts.toggleFindBar(); return }
      if (isCmdOrCtrl && e.key === 'd') { e.preventDefault(); shortcuts.toggleTheme(); return }
      if (isCmdOrCtrl && e.shiftKey && e.key === 'S') { e.preventDefault(); shortcuts.saveFileAs(); return }
      if (isCmdOrCtrl && e.key === 's') { e.preventDefault(); shortcuts.saveFile(); return }
      if (isCmdOrCtrl && e.key === 'o') { e.preventDefault(); shortcuts.openFile(); return }
      if (isCmdOrCtrl && e.key === 'p') { e.preventDefault(); shortcuts.exportPDF(); return }
      if (isCmdOrCtrl && e.key === 'e') { e.preventDefault(); shortcuts.cycleViewMode(); return }
      if (isCmdOrCtrl && e.shiftKey && e.key === 'H') { e.preventDefault(); shortcuts.exportHTML(); return }
      if (isCmdOrCtrl && e.key === 'r') { e.preventDefault(); shortcuts.toggleReadingMode(); return }
      if (isCmdOrCtrl && e.key === 't') { e.preventDefault(); shortcuts.addTab(); return }

      if (isCmdOrCtrl && e.key === 'b') {
        e.preventDefault()
        const el = document.querySelector('textarea') as HTMLTextAreaElement
        if (el) wrapSelection(el, '**', '**')
        return
      }

      if (isCmdOrCtrl && e.key === 'i') {
        e.preventDefault()
        const el = document.querySelector('textarea') as HTMLTextAreaElement
        if (el) wrapSelection(el, '*', '*')
        return
      }

      // Bare-key shortcuts must NOT fire while user is typing
      if (typing) return

      if (e.key === '?') { e.preventDefault(); shortcuts.toggleShortcuts(); return }
      if (e.key === 'Escape') { shortcuts.closeModal() }
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
