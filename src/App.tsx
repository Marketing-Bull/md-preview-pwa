import React, { useState, useEffect, useCallback } from 'react'
import { useStore } from './store'
import { useFindReplace } from './hooks/useFindReplace'
import { useMarkdown } from './hooks/useMarkdown'
import { useHighlightTheme } from './hooks/useHighlightTheme'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useDragDrop } from './hooks/useDragDrop'
import { openFile, saveFile, exportPDF, exportHTML } from './utils/fileOperations'
import { decodeContentFromUrl, shareContent } from './utils/shareUrl'

import { Toolbar } from './components/Toolbar'
import { Editor } from './components/Editor'
import { Preview } from './components/Preview'
// import { Sidebar } from './components/Sidebar'
import { FindBar } from './components/FindBar'
import { StatusBar } from './components/StatusBar'
import { KeyboardShortcuts } from './components/KeyboardShortcuts'
import { InstallGuide } from './components/InstallGuide'
import { ColumnResizer } from './components/ColumnResizer'
import { DropOverlay } from './components/DropOverlay'
import { MobileTabBar } from './components/MobileTabBar'
import { MobileSwipe } from './components/MobileSwipe'
import { ReadingModeControls } from './components/ReadingModeControls'
import { TabBar } from './components/TabBar'

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
    addFile,
    columnRatio,
  } = useStore()

  const [isMobile, setIsMobile] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showInstallGuide, setShowInstallGuide] = useState(false)

  // Sync theme class to body so body background and legacy selectors update
  useEffect(() => {
    document.body.classList.toggle('light-mode', !isDarkMode)
    document.body.classList.toggle('dark-mode', isDarkMode)
  }, [isDarkMode])

  // Load highlight.js theme stylesheet
  useHighlightTheme()

  // Load shared content from URL on mount
  useEffect(() => {
    const sharedContent = decodeContentFromUrl()
    if (sharedContent) {
      setContent(sharedContent)
      setFileName('shared.md')
    }
  }, [])

  // Detect mobile mode (≤768px) — debounced to avoid losing editor content on rapid resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    let timer: ReturnType<typeof setTimeout>
    const onResize = () => { clearTimeout(timer); timer = setTimeout(checkMobile, 150) }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); clearTimeout(timer) }
  }, [])

  const { html } = useMarkdown(content, isDarkMode)
  const { currentIndex, matchCount, findNext, findPrev, doReplace, doReplaceAll, doFind } = useFindReplace(content)

  const isDragOver = useDragDrop({
    onFileDrop: useCallback((text: string, name: string) => {
      setContent(text)
      setFileName(name)
    }, [setContent, setFileName]),
  })

  useKeyboardShortcuts({
    openFile: handleOpen,
    saveFile: handleSave,
    toggleTheme: () => useStore.setState((s) => ({ isDarkMode: !s.isDarkMode })),
    toggleFindBar: () => setShowFindBar(!showFindBar),
    exportPDF: handleExportPDF,
    exportHTML: handleExportHTML,
    cycleViewMode: handleCycleViewMode,
    share: handleShare,
    toggleReadingMode: () => setReadingMode(!readingMode),
    addTab: () => addFile('untitled.md'),
    toggleShortcuts: () => setShowShortcuts(!showShortcuts),
    closeModal: () => { setShowFindBar(false); setShowShortcuts(false) },
  })

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

  async function handleSave() {
    const name = fileName || 'document.md'
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as Window & typeof globalThis & { showSaveFilePicker: (opts: object) => Promise<FileSystemFileHandle> }).showSaveFilePicker({
          suggestedName: name,
          types: [{ description: 'Markdown', accept: { 'text/markdown': ['.md', '.markdown'] } }],
        })
        const writable = await handle.createWritable()
        await writable.write(content)
        await writable.close()
        setFileName(handle.name)
        return
      } catch (e) {
        if ((e as Error).name === 'AbortError') return
      }
    }
    saveFile(content, name)
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

  async function handleShare() {
    const success = await shareContent(content, fileName || 'document.md')
    if (success && !navigator.share) {
      // Copied to clipboard (not using Web Share API)
      // Could show a toast notification here
    }
  }

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'} ${isMobile ? 'mobile' : ''}`}>
      <Toolbar
        onNew={() => addFile('untitled.md')}
        onOpen={handleOpen}
        onSave={handleSave}
        onExportHTML={handleExportHTML}
        onExportPDF={handleExportPDF}
        onShare={handleShare}
        onShowFind={() => setShowFindBar(true)}
        onShowShortcuts={() => setShowShortcuts(true)}
        onShowInstallGuide={() => setShowInstallGuide(true)}
        onToggleReadingMode={() => setReadingMode(!readingMode)}
        readingMode={readingMode}
        fileName={fileName}
        onFileNameChange={setFileName}
      />

      {!isMobile && <TabBar />}

      {readingMode && <ReadingModeControls />}

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
          <div
            className="editor-pane"
            style={viewMode === 'split' ? { flex: `0 0 ${columnRatio * 100}%` } : undefined}
          >
            <Editor
              onContentChange={(newContent) => {
                setContent(newContent)
                doFind(newContent)
              }}
            />
          </div>

          {viewMode === 'split' && <ColumnResizer />}

          <div
            className="preview-pane"
            style={viewMode === 'split' ? { flex: `0 0 ${(1 - columnRatio) * 100}%` } : undefined}
          >
            <Preview />
          </div>
        </div>
      )}

      <StatusBar />

      <KeyboardShortcuts visible={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <InstallGuide visible={showInstallGuide} onClose={() => setShowInstallGuide(false)} />

      <DropOverlay visible={isDragOver} />
    </div>
  )
}
