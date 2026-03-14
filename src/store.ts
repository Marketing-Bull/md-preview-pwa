import { create } from 'zustand'

export type ViewMode = 'split' | 'editor' | 'preview'
export type HighlightTheme = 'github' | 'github-dark' | 'monokai' | 'dracula' | 'solarized-dark' | 'atom-one-dark' | 'vs-light'

interface AppStore {
  // Content
  content: string
  setContent: (content: string) => void
  fileName: string
  setFileName: (name: string) => void

  // UI
  isDarkMode: boolean
  toggleTheme: () => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  showFindBar: boolean
  setShowFindBar: (show: boolean) => void

  // Editor
  columnRatio: number
  setColumnRatio: (ratio: number) => void
  highlightTheme: HighlightTheme
  setHighlightTheme: (theme: HighlightTheme) => void

  // Search
  findQuery: string
  setFindQuery: (query: string) => void
  replaceQuery: string
  setReplaceQuery: (query: string) => void
  findCaseSensitive: boolean
  setFindCaseSensitive: (value: boolean) => void
  findRegex: boolean
  setFindRegex: (value: boolean) => void

  // Auto-save
  lastSaved: Date | null

  // Reading mode
  readingMode: boolean
  setReadingMode: (mode: boolean) => void
  fontSize: number
  setFontSize: (size: number) => void
  lineHeight: number
  setLineHeight: (height: number) => void
  sepia: boolean
  setSepia: (enabled: boolean) => void
}

const STORAGE_KEYS = {
  THEME: 'md-preview-theme',
  COLUMN_RATIO: 'md-preview-column-ratio',
  HIGHLIGHT_THEME: 'md-preview-highlight-theme',
  VIEW_MODE: 'md-preview-view-mode',
  AUTO_SAVE_CONTENT: 'md-preview-autosave-content',
  AUTO_SAVE_FILENAME: 'md-preview-autosave-filename',
  AUTO_SAVE_TIME: 'md-preview-autosave-time',
  READING_MODE: 'md-preview-reading-mode',
  FONT_SIZE: 'md-preview-font-size',
  LINE_HEIGHT: 'md-preview-line-height',
  SEPIA: 'md-preview-sepia',
}

const loadTheme = (): boolean => {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(STORAGE_KEYS.THEME) !== 'light'
}

const loadColumnRatio = (): number => {
  if (typeof window === 'undefined') return 1
  const saved = localStorage.getItem(STORAGE_KEYS.COLUMN_RATIO)
  return saved ? parseFloat(saved) : 1
}

const loadHighlightTheme = (): HighlightTheme => {
  if (typeof window === 'undefined') return 'atom-one-dark'
  return (localStorage.getItem(STORAGE_KEYS.HIGHLIGHT_THEME) as HighlightTheme) || 'atom-one-dark'
}

const loadViewMode = (): ViewMode => {
  if (typeof window === 'undefined') return 'split'
  return (localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as ViewMode) || 'split'
}

const loadAutoSavedContent = (): { content: string; fileName: string } | null => {
  if (typeof window === 'undefined') return null
  const content = localStorage.getItem(STORAGE_KEYS.AUTO_SAVE_CONTENT)
  const fileName = localStorage.getItem(STORAGE_KEYS.AUTO_SAVE_FILENAME)
  const time = localStorage.getItem(STORAGE_KEYS.AUTO_SAVE_TIME)
  if (content && time) {
    return { content, fileName: fileName || 'untitled.md' }
  }
  return null
}

const loadReadingMode = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEYS.READING_MODE) === 'true'
}

const loadFontSize = (): number => {
  if (typeof window === 'undefined') return 16
  return parseInt(localStorage.getItem(STORAGE_KEYS.FONT_SIZE) || '16')
}

const loadLineHeight = (): number => {
  if (typeof window === 'undefined') return 1.6
  return parseFloat(localStorage.getItem(STORAGE_KEYS.LINE_HEIGHT) || '1.6')
}

const loadSepia = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEYS.SEPIA) === 'true'
}

// Auto-save interval (5 seconds)
let autoSaveInterval: ReturnType<typeof setInterval> | null = null

const startAutoSave = () => {
  if (autoSaveInterval) return
  autoSaveInterval = setInterval(() => {
    const state = useStore.getState()
    localStorage.setItem(STORAGE_KEYS.AUTO_SAVE_CONTENT, state.content)
    localStorage.setItem(STORAGE_KEYS.AUTO_SAVE_FILENAME, state.fileName)
    localStorage.setItem(STORAGE_KEYS.AUTO_SAVE_TIME, new Date().toISOString())
    useStore.setState({ lastSaved: new Date() })
  }, 5000)
}

const autoSaved = loadAutoSavedContent()

export const useStore = create<AppStore>((set) => ({
  content: autoSaved?.content || `# Welcome to MD Preview ⚡

A fast **Markdown + Mermaid** previewer with PDF export.

## Features

- ✅ Live preview as you type
- ✅ Mermaid diagram rendering
- ✅ Syntax-highlighted code blocks
- ✅ Export to **PDF** or **HTML**
- ✅ Drag & drop \`.md\` files
- ✅ GFM tables, task lists, blockquotes

## Example Table

| Feature | Status |
|---------|--------|
| Markdown | ✅ |
| Mermaid | ✅ |
| Code Highlighting | ✅ |
| PDF Export | ✅ |

## Mermaid Diagram

\`\`\`mermaid
graph LR
    A[Markdown Input] --> B[Marked.js Parser]
    B --> C{Has Mermaid?}
    C -->|Yes| D[Mermaid Renderer]
    C -->|No| E[HTML Preview]
    D --> E
    E --> F[Export PDF/HTML]
\`\`\`

## Code Block

\`\`\`javascript
const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
};
greet('Alex');
\`\`\`

## Task List

- [x] Build the app
- [x] Add Mermaid support
- [ ] Take over the world

> **Tip:** Paste or type any Markdown. Mermaid diagrams render automatically!
`,

  setContent: (content) => set({ content }),

  fileName: autoSaved?.fileName || 'untitled.md',
  setFileName: (name) => set({ fileName: name }),

  isDarkMode: loadTheme(),
  toggleTheme: () => set((state) => {
    const newMode = !state.isDarkMode
    localStorage.setItem(STORAGE_KEYS.THEME, newMode ? 'dark' : 'light')
    return { isDarkMode: newMode }
  }),

  viewMode: loadViewMode(),
  setViewMode: (mode) => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode)
    set({ viewMode: mode })
  },

  showFindBar: false,
  setShowFindBar: (show) => set({ showFindBar: show }),

  columnRatio: loadColumnRatio(),
  setColumnRatio: (ratio) => {
    localStorage.setItem(STORAGE_KEYS.COLUMN_RATIO, ratio.toString())
    set({ columnRatio: ratio })
  },

  highlightTheme: loadHighlightTheme(),
  setHighlightTheme: (theme) => {
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHT_THEME, theme)
    set({ highlightTheme: theme })
  },

  findQuery: '',
  setFindQuery: (query) => set({ findQuery: query }),

  replaceQuery: '',
  setReplaceQuery: (query) => set({ replaceQuery: query }),

  findCaseSensitive: false,
  setFindCaseSensitive: (value) => set({ findCaseSensitive: value }),

  findRegex: false,
  setFindRegex: (value) => set({ findRegex: value }),

  lastSaved: null,

  readingMode: loadReadingMode(),
  setReadingMode: (mode) => {
    localStorage.setItem(STORAGE_KEYS.READING_MODE, mode ? 'true' : 'false')
    set({ readingMode: mode })
  },

  fontSize: loadFontSize(),
  setFontSize: (size) => {
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, size.toString())
    set({ fontSize: size })
  },

  lineHeight: loadLineHeight(),
  setLineHeight: (height) => {
    localStorage.setItem(STORAGE_KEYS.LINE_HEIGHT, height.toString())
    set({ lineHeight: height })
  },

  sepia: loadSepia(),
  setSepia: (enabled) => {
    localStorage.setItem(STORAGE_KEYS.SEPIA, enabled ? 'true' : 'false')
    set({ sepia: enabled })
  },
}))

// Start auto-save on load
if (typeof window !== 'undefined') {
  startAutoSave()
}
