import { create } from 'zustand'

export type ViewMode = 'split' | 'editor' | 'preview'
export type HighlightTheme = 'github' | 'github-dark' | 'monokai' | 'dracula' | 'solarized-dark' | 'atom-one-dark' | 'vs-light'
export type AccentPreset = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan' | 'red' | 'gold' | 'custom'

export const ACCENT_PRESETS: Record<AccentPreset, { accent: string; hover: string; text: string }> = {
  blue:   { accent: '#4da6ff', hover: '#66b3ff', text: '#000' },
  purple: { accent: '#a78bfa', hover: '#c4b5fd', text: '#000' },
  green:  { accent: '#4ade80', hover: '#6ee7a0', text: '#000' },
  orange: { accent: '#fb923c', hover: '#fdba74', text: '#000' },
  pink:   { accent: '#f472b6', hover: '#f9a8d4', text: '#000' },
  cyan:   { accent: '#22d3ee', hover: '#67e8f9', text: '#000' },
  red:    { accent: '#f87171', hover: '#fca5a5', text: '#000' },
  gold:   { accent: '#fbbf24', hover: '#fcd34d', text: '#000' },
  custom: { accent: '#4da6ff', hover: '#66b3ff', text: '#000' },
}

/** Compute a lighter hover shade and contrast text for any hex color */
export const buildCustomAccent = (hex: string): { accent: string; hover: string; text: string } => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  // Lighter hover
  const lighten = (c: number) => Math.min(255, c + 40)
  const hover = `#${lighten(r).toString(16).padStart(2,'0')}${lighten(g).toString(16).padStart(2,'0')}${lighten(b).toString(16).padStart(2,'0')}`
  // Perceived brightness → pick black or white text
  const luma = 0.299 * r + 0.587 * g + 0.114 * b
  const text = luma > 150 ? '#000' : '#fff'
  return { accent: hex, hover, text }
}

export const WELCOME_FILE_ID = 'welcome'

export interface FileData {
  id: string
  name: string
  content: string
  lastModified: number
}

interface AppStore {
  // Multiple files
  files: Record<string, FileData>
  activeFileId: string
  addFile: (name: string, content?: string) => string
  deleteFile: (id: string) => void
  closeAllFiles: () => void
  setActiveFile: (id: string) => void
  updateFile: (id: string, name?: string, content?: string) => void

  // Content (shortcuts for current file)
  content: string
  setContent: (content: string) => void
  fileName: string
  setFileName: (name: string) => void

  // File handle for Save (File System Access API)
  fileHandle: FileSystemFileHandle | null
  setFileHandle: (handle: FileSystemFileHandle | null) => void

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

  // Accent color
  accentPreset: AccentPreset
  setAccentPreset: (preset: AccentPreset) => void
  customAccentHex: string
  setCustomAccentHex: (hex: string) => void

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
  FILES: 'md-preview-files',
  ACTIVE_FILE_ID: 'md-preview-active-file-id',
  ACCENT_PRESET: 'md-preview-accent-preset',
  CUSTOM_ACCENT_HEX: 'md-preview-custom-accent-hex',
}

const loadTheme = (): boolean => {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(STORAGE_KEYS.THEME) !== 'light'
}

const loadColumnRatio = (): number => {
  if (typeof window === 'undefined') return 1
  const saved = localStorage.getItem(STORAGE_KEYS.COLUMN_RATIO)
  if (!saved) return 0.5
  const v = parseFloat(saved)
  return v >= 0.2 && v <= 0.8 ? v : 0.5
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

const loadAccentPreset = (): AccentPreset => {
  if (typeof window === 'undefined') return 'blue'
  return (localStorage.getItem(STORAGE_KEYS.ACCENT_PRESET) as AccentPreset) || 'blue'
}

const loadCustomAccentHex = (): string => {
  if (typeof window === 'undefined') return '#4da6ff'
  return localStorage.getItem(STORAGE_KEYS.CUSTOM_ACCENT_HEX) || '#4da6ff'
}

// Hydrate custom preset from saved hex on startup
;(() => {
  const hex = loadCustomAccentHex()
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    ACCENT_PRESETS.custom = buildCustomAccent(hex)
  }
})()

const generateFileId = (): string => {
  return `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const loadFiles = (): Record<string, FileData> => {
  if (typeof window === 'undefined') return {}
  const savedFiles = localStorage.getItem(STORAGE_KEYS.FILES)
  if (savedFiles) {
    try {
      return JSON.parse(savedFiles)
    } catch {
      return {}
    }
  }
  return {}
}

const loadActiveFileId = (): string => {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_FILE_ID) || ''
}

const WELCOME_CONTENT = `# MB Editor — Markdown Reference

A fast **Markdown + HTML + Mermaid** editor with live preview, JSON validation, and export.

---

## Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

## Text Formatting

This is **bold text** and this is *italic text*.

This is ***bold and italic*** together.

This is ~~strikethrough~~ text.

This is \`inline code\` within a sentence.

---

## Links & Images

[Visit Marketing Bull](https://marketingbull.com.au)

![Placeholder image](https://via.placeholder.com/400x200?text=Markdown+Preview)

---

## Lists

### Unordered List
- First item
- Second item
  - Nested item A
  - Nested item B
- Third item

### Ordered List
1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

### Task List
- [x] Build the editor
- [x] Add Mermaid support
- [x] Add HTML editing
- [x] Customizable accent colors
- [ ] Take over the world

---

## Blockquotes

> This is a blockquote. It can span multiple lines.
>
> > Nested blockquotes are also supported.

> **Tip:** Press \`?\` to see all keyboard shortcuts!

---

## Collapsible Sections

<details>
<summary>Click to expand — Features list</summary>

- Live preview as you type
- Mermaid diagram rendering
- Syntax-highlighted code blocks
- Export to PDF or HTML
- Drag & drop files
- GFM tables, task lists, blockquotes
- JSON & JSON5 validation
- Custom dark mode accent colors
- Works offline as a PWA

</details>

<details>
<summary>Click to expand — Keyboard Shortcuts</summary>

| Action | Shortcut |
|--------|----------|
| New tab | \`Cmd+T\` |
| Open file | \`Cmd+O\` |
| Save | \`Cmd+S\` |
| Find & Replace | \`Cmd+F\` |
| Toggle dark mode | \`Cmd+D\` |
| Export PDF | \`Cmd+P\` |

</details>

<details>
<summary>Click to expand — Changelog</summary>

### v2.0
- HTML file editing & preview
- Customizable accent colors in dark mode
- Collapsible sections support
- Close All Tabs feature

### v1.0
- Markdown editing with live preview
- Mermaid diagrams
- JSON validation
- PDF & HTML export

</details>

---

## Tables

| Feature | Status | Notes |
|---------|:------:|------:|
| Markdown (GFM) | ✅ | Full support |
| HTML editing | ✅ | Live preview |
| Mermaid diagrams | ✅ | Auto-render |
| Code highlighting | ✅ | 180+ languages |
| JSON validation | ✅ | JSON5 too |
| PDF export | ✅ | High quality |
| Dark mode | ✅ | Custom colors |
| Offline PWA | ✅ | Install to dock |

---

## Code Blocks

### JavaScript
\`\`\`javascript
const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
};
greet('World');
\`\`\`

### Python
\`\`\`python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

print(list(fibonacci(10)))
\`\`\`

### CSS
\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 2rem;
}
\`\`\`

---

## Mermaid Diagrams

### Flowchart
\`\`\`mermaid
graph LR
    A[Markdown Input] --> B[Marked.js Parser]
    B --> C{Has Mermaid?}
    C -->|Yes| D[Mermaid Renderer]
    C -->|No| E[HTML Preview]
    D --> E
    E --> F[Export PDF/HTML]
\`\`\`

### Sequence Diagram
\`\`\`mermaid
sequenceDiagram
    participant User
    participant Editor
    participant Preview
    User->>Editor: Types markdown
    Editor->>Preview: Renders HTML
    Preview-->>User: Shows live preview
\`\`\`

---

## Horizontal Rules

Three different syntaxes all produce a horizontal rule:

---

***

___

---

## HTML in Markdown

You can use raw HTML when Markdown isn't enough:

<div style="padding: 12px; border: 2px solid #4da6ff; border-radius: 8px; background: rgba(77,166,255,0.1);">
  <strong>Custom HTML block:</strong> This is styled with inline HTML + CSS.
</div>

<br>

<kbd>Cmd</kbd> + <kbd>S</kbd> to save &nbsp;|&nbsp; <kbd>Cmd</kbd> + <kbd>P</kbd> to export PDF

---

## Footnotes & Extras

Text with a footnote reference[^1].

[^1]: This is the footnote content.

Term
: This is a definition list entry.

---

*Built with ❤️ by [Marketing Bull](https://marketingbull.com.au)*
`

const createWelcomeFile = (): FileData => ({
  id: WELCOME_FILE_ID,
  name: 'example.md',
  content: WELCOME_CONTENT,
  lastModified: Date.now(),
})

const createDefaultFile = (): FileData => {
  const id = generateFileId()
  return {
    id,
    name: 'untitled.md',
    content: WELCOME_CONTENT,
    lastModified: Date.now(),
  }
}

// Auto-save interval (5 seconds)
let autoSaveInterval: ReturnType<typeof setInterval> | null = null
let lastSavedSnapshot = ''

const startAutoSave = () => {
  if (autoSaveInterval) return
  autoSaveInterval = setInterval(() => {
    const state = useStore.getState()
    const snapshot = JSON.stringify(state.files) + state.activeFileId
    if (snapshot === lastSavedSnapshot) return
    lastSavedSnapshot = snapshot
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(state.files))
    localStorage.setItem(STORAGE_KEYS.ACTIVE_FILE_ID, state.activeFileId)
    localStorage.setItem(STORAGE_KEYS.AUTO_SAVE_TIME, new Date().toISOString())
    useStore.setState({ lastSaved: new Date() })
  }, 5000)
}

// Load files and always ensure a welcome tab exists
const loadedFiles = loadFiles()
const loadedActiveFileId = loadActiveFileId()
let initialFiles = loadedFiles
let initialActiveFileId = loadedActiveFileId

if (Object.keys(initialFiles).length === 0) {
  // No saved files — check legacy auto-save, otherwise just show welcome
  const autoSaved = loadAutoSavedContent()
  if (autoSaved) {
    const legacyFile = createDefaultFile()
    legacyFile.name = autoSaved.fileName
    legacyFile.content = autoSaved.content
    initialFiles = { [legacyFile.id]: legacyFile }
    initialActiveFileId = legacyFile.id
  }
}

// Always inject a fresh welcome tab
const welcomeFile = createWelcomeFile()
initialFiles = { [WELCOME_FILE_ID]: welcomeFile, ...initialFiles }
// If no valid active file, default to welcome
if (!initialFiles[initialActiveFileId]) {
  initialActiveFileId = WELCOME_FILE_ID
}

const initialActiveFile = initialFiles[initialActiveFileId]

export const useStore = create<AppStore>((set, _get) => ({
  // Multiple files
  files: initialFiles,
  activeFileId: initialActiveFileId,

  addFile: (name: string, content?: string) => {
    const id = generateFileId()
    const fileContent = content || ''
    const newFile: FileData = { id, name, content: fileContent, lastModified: Date.now() }
    set((state) => ({
      files: { ...state.files, [id]: newFile },
      activeFileId: id,
      content: fileContent,
      fileName: name,
    }))
    return id
  },

  deleteFile: (id: string) => {
    set((state) => {
      const newFiles = { ...state.files }
      delete newFiles[id]
      const remainingIds = Object.keys(newFiles)
      if (remainingIds.length === 0) {
        // If no files remain, create a fresh welcome tab
        const welcome = createWelcomeFile()
        return {
          files: { [welcome.id]: welcome },
          activeFileId: welcome.id,
          content: welcome.content,
          fileName: welcome.name,
        }
      }
      let newActiveId = state.activeFileId
      if (id === state.activeFileId) {
        newActiveId = remainingIds[0]
      }
      const newActive = newFiles[newActiveId]
      return {
        files: newFiles,
        activeFileId: newActiveId,
        content: newActive?.content || '',
        fileName: newActive?.name || 'untitled.md',
      }
    })
  },

  closeAllFiles: () => {
    const welcome = createWelcomeFile()
    set({
      files: { [welcome.id]: welcome },
      activeFileId: welcome.id,
      content: welcome.content,
      fileName: welcome.name,
    })
  },

  setActiveFile: (id: string) => {
    set((state) => ({
      activeFileId: id,
      content: state.files[id]?.content || '',
      fileName: state.files[id]?.name || 'untitled.md',
    }))
  },

  updateFile: (id: string, name?: string, content?: string) => {
    set((state) => {
      const file = state.files[id]
      if (!file) return {}
      const updatedFile = {
        ...file,
        name: name !== undefined ? name : file.name,
        content: content !== undefined ? content : file.content,
        lastModified: Date.now(),
      }
      const isActive = id === state.activeFileId
      return {
        files: { ...state.files, [id]: updatedFile },
        ...(isActive && { content: updatedFile.content, fileName: updatedFile.name }),
      }
    })
  },

  // Content shortcuts for current file — plain state, not getters
  content: initialActiveFile?.content || '',

  setContent: (content: string) => {
    set((s) => {
      if (!s.files[s.activeFileId]) return {}
      return {
        content,
        files: {
          ...s.files,
          [s.activeFileId]: { ...s.files[s.activeFileId]!, content, lastModified: Date.now() },
        },
      }
    })
  },

  fileName: initialActiveFile?.name || 'untitled.md',

  fileHandle: null,
  setFileHandle: (handle) => set({ fileHandle: handle }),

  setFileName: (name: string) => {
    set((s) => {
      if (!s.files[s.activeFileId]) return {}
      return {
        fileName: name,
        files: {
          ...s.files,
          [s.activeFileId]: { ...s.files[s.activeFileId]!, name, lastModified: Date.now() },
        },
      }
    })
  },

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

  accentPreset: loadAccentPreset(),
  setAccentPreset: (preset) => {
    localStorage.setItem(STORAGE_KEYS.ACCENT_PRESET, preset)
    set({ accentPreset: preset })
  },

  customAccentHex: loadCustomAccentHex(),
  setCustomAccentHex: (hex) => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ACCENT_HEX, hex)
    // Update the custom preset entry in-memory
    const colors = buildCustomAccent(hex)
    ACCENT_PRESETS.custom = colors
    set({ customAccentHex: hex, accentPreset: 'custom' })
    localStorage.setItem(STORAGE_KEYS.ACCENT_PRESET, 'custom')
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
