import { useEffect, useState } from 'react'

interface DragDropHandlers {
  onFileDrop: (content: string, fileName: string) => void
}

export const useDragDrop = ({ onFileDrop }: DragDropHandlers): boolean => {
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(true)
    }

    const handleDragLeave = (e: DragEvent) => {
      if ((e.target as Node).nodeType === Node.DOCUMENT_NODE) {
        setIsDragOver(false)
      }
    }

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      const files = e.dataTransfer?.files
      if (!files || files.length === 0) return

      const file = files[0]
      if (!file.type.includes('text') && !file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
        alert('Please drop a markdown or text file')
        return
      }

      try {
        const text = await file.text()
        onFileDrop(text, file.name)
      } catch {
        alert('Error reading file')
      }
    }

    const handleDragEnd = () => setIsDragOver(false)

    document.addEventListener('dragover', handleDragOver)
    document.addEventListener('dragleave', handleDragLeave)
    document.addEventListener('drop', handleDrop)
    document.addEventListener('dragend', handleDragEnd)

    return () => {
      document.removeEventListener('dragover', handleDragOver)
      document.removeEventListener('dragleave', handleDragLeave)
      document.removeEventListener('drop', handleDrop)
      document.removeEventListener('dragend', handleDragEnd)
    }
  }, [onFileDrop])

  return isDragOver
}
