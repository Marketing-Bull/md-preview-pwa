import React, { useState, useEffect } from 'react'
import { useStore } from './store'
import { useFindReplace } from './hooks/useFindReplace'
import { useMarkdown } from './hooks/useMarkdown'
import { openFile, saveFile, exportPDF, exportHTML } from './utils/fileOperations'

import { Toolbar } from './components/Toolbar'
import { Editor } from './components/Editor'
import { Preview } from './components/Preview'
// import { Sidebar } from './components/Sidebar'
import { FindBar } from './components/FindBar'
import { StatusBar } from './components/StatusBar'
import { KeyboardShortcuts } from './components/KeyboardShortcuts'
import { ColumnResizer } from './components/ColumnResizer'
import { DropOverlay } from './components/DropOverlay'

export const App: React.FC = () => {
  const {
    content,
    fileName,
    setFileName,
    setContent,
    isDarkMode,
    viewMode,
    showFindBar,
    setShowFindBar,
  } = useStore()


  const [showShortcuts, setShowShortcuts] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const { html } = useMarkdown(content, isDarkMode)
  const { currentIndex, matchCount, findNext, findPrev, doReplace, doReplaceAll, doFind } = useFindReplace(content)

  // Register keyboard shortcuts (just used for side effects)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const isCmd = isMac ? e.metaKey : e.ctrlKey

      if (isCmd && e.key === 'f') {
        e.preventDefault()
        setShowFindBar(!showFindBar)
      }
      if (isCmd && e.key === 'd') {
        e.preventDefault()
        useStore.setState((state) => ({ isDarkMode: !state.isDarkMode }))
      }
      if (isCmd && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      if (isCmd && e.key === 'o') {
        e.preventDefault()
        handleOpen()
      }
      if (isCmd && e.key === 'p') {
        e.preventDefault()
        handleExportPDF()
      }
      if (isCmd && e.key === 'e') {
        e.preventDefault()
        handleCycleViewMode()
      }
      if (e.key === 'Escape') {
        setShowFindBar(false)
        setShowShortcuts(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showFindBar])

  // Handle drag and drop
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      setIsDragOver(true)
    }

    const handleDragLeave = () => {
      setIsDragOver(false)
    }

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault()
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
        setContent(text)
        setFileName(file.name)
      } catch (error) {
        console.error('Error reading dropped file:', error)
        alert('Error reading file')
      }
    }

    document.addEventListener('dragover', handleDragOver)
    document.addEventListener('dragleave', handleDragLeave)
    document.addEventListener('drop', handleDrop)

    return () => {
      document.removeEventListener('dragover', handleDragOver)
      document.removeEventListener('dragleave', handleDragLeave)
      document.removeEventListener('drop', handleDrop)
    }
  }, [setContent, setFileName])

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(new URL('./sw.ts', import.meta.url), {
        type: 'module',
      }).catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
    }
  }, [])

  async function handleOpen() {
    const result = await openFile()
    if (result) {
      setContent(result.content)
      setFileName(result.fileName)
    }
  }

  function handleSave() {
    saveFile(content, fileName || 'document.md')
  }

  function handleExportPDF() {
    exportPDF(html, fileName || 'document.md')
  }

  function handleExportHTML() {
    exportHTML(html, fileName || 'document.md')
  }

  function handleCycleViewMode() {
    const modes: Array<'split' | 'editor' | 'preview'> = ['split', 'editor', 'preview']
    const currentIndex = modes.indexOf(viewMode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    useStore.setState({ viewMode: nextMode })
  }

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Toolbar
        onOpen={handleOpen}
        onSave={handleSave}
        onExportHTML={handleExportHTML}
        fileName={fileName}
        onFileNameChange={setFileName}
      />

      <div className={`main-container view-${viewMode}`}>
        <div className="editor-pane">
          <Editor
            onContentChange={(newContent) => {
              setContent(newContent)
              doFind(newContent)
            }}
          />
          <FindBar
            visible={showFindBar}
            matchCount={matchCount}
            currentMatch={currentIndex}
            onClose={() => setShowFindBar(false)}
            onFind={doFind}
            onNext={findNext}
            onPrev={findPrev}
            onReplace={doReplace}
            onReplaceAll={doReplaceAll}
          />
        </div>

        {viewMode === 'split' && <ColumnResizer />}

        <div className="preview-pane">
          <Preview />
        </div>
      </div>

      <StatusBar />

      <KeyboardShortcuts visible={showShortcuts} onClose={() => setShowShortcuts(false)} />

      <DropOverlay visible={isDragOver} />
    </div>
  )
}
