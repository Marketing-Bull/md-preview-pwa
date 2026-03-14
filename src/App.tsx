import React, { useState, useEffect } from 'react'
import { useStore } from './store'
import { useFindReplace } from './hooks/useFindReplace'
import { useMarkdown } from './hooks/useMarkdown'
import { useHighlightTheme } from './hooks/useHighlightTheme'
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
import { MobileTabBar } from './components/MobileTabBar'
import { MobileSwipe } from './components/MobileSwipe'
import { ReadingModeControls } from './components/ReadingModeControls'

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
    readingMode,
    setReadingMode,
    fontSize,
    lineHeight,
    sepia,
  } = useStore()

  const [isMobile, setIsMobile] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  // Load highlight.js theme stylesheet
  useHighlightTheme()

  // Detect mobile mode (≤768px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      if (isCmd && e.shiftKey && e.key === 'H') {
        e.preventDefault()
        handleExportHTML()
      }
      if (isCmd && e.key === 'r') {
        e.preventDefault()
        setReadingMode(!readingMode)
      }
      if (e.key === '?') {
        e.preventDefault()
        setShowShortcuts(!showShortcuts)
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

  const handleLoadFile = (content: string, fileName: string) => {
    setContent(content)
    setFileName(fileName)
    doFind(content)
  }

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'} ${isMobile ? 'mobile' : ''}`}>
      <Toolbar
        onOpen={handleOpen}
        onSave={handleSave}
        onExportHTML={handleExportHTML}
        onShowFind={() => setShowFindBar(true)}
        onShowShortcuts={() => setShowShortcuts(true)}
        onExportPDF={handleExportPDF}
        onToggleReadingMode={() => setReadingMode(!readingMode)}
        readingMode={readingMode}
        fileName={fileName}
        onFileNameChange={setFileName}
        onLoadFile={handleLoadFile}
      />

      {readingMode && <ReadingModeControls />}

      {readingMode ? (
        <div className="reading-mode-container" style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight, filter: sepia ? 'sepia(0.3)' : 'none' }}>
          <Preview />
        </div>
      ) : isMobile ? (
        <>
          <MobileSwipe>
            <div className="swipe-pane editor-pane">
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

            <div className="swipe-pane split-pane">
              <div className="editor-pane">
                <Editor
                  onContentChange={(newContent) => {
                    setContent(newContent)
                    doFind(newContent)
                  }}
                />
              </div>
              <ColumnResizer />
              <div className="preview-pane">
                <Preview />
              </div>
            </div>

            <div className="swipe-pane preview-pane">
              <Preview />
            </div>
          </MobileSwipe>
          <MobileTabBar />
        </>
      ) : (
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
      )}

      <StatusBar />

      <KeyboardShortcuts visible={showShortcuts} onClose={() => setShowShortcuts(false)} />

      <DropOverlay visible={isDragOver} />
    </div>
  )
}
