# Markdown Editor & Preview by Marketing Bull

**A fast, offline-first Markdown + HTML + Mermaid editor. No accounts, no cloud, no tracking.**

**Live demo:** [md.getmarketingbull.com](https://md.getmarketingbull.com)

Write markdown or HTML, see it rendered live, validate JSON, draw diagrams, customize your theme, and export clean PDFs — all from one tool that runs entirely in your browser.

---

## Features at a Glance

- Live Markdown preview as you type
- HTML file editing with sandboxed live preview
- Mermaid diagram rendering (flowcharts, sequence, ER, Gantt, and more)
- JSON & JSON5 syntax validation with error line/column highlighting
- Syntax-highlighted code blocks with one-click copy
- Export to PDF or standalone HTML
- Multiple tabs — open and edit several files at once
- Find & Replace with regex, case-sensitivity, and match navigation
- Reading mode — distraction-free centered layout with adjustable font and sepia tone
- Customizable accent colors — 8 presets + custom HEX input
- Share as URL — encode your document as a shareable link or use the Web Share API
- Collapsible sections (`<details>`/`<summary>`) in markdown
- Auto-save to `localStorage` — nothing sent to any server, ever
- Dark and light themes with accent-colored headings, tables, and UI elements
- PWA — installs as an app, works offline
- Drag & drop `.md`, `.txt`, and `.html` files

---

## Editor

| Feature | Detail |
|---------|--------|
| **Live Preview** | Renders as you type with a 150 ms debounce |
| **Split View** | Resizable editor/preview columns with a drag divider |
| **View Modes** | Split · Editor Only · Preview Only — cycle with `Cmd+E` or the toolbar button |
| **Scroll Sync** | Editor and preview scroll in proportion; timer-based lock prevents infinite loops |
| **Tab Support** | Tab inserts 2 spaces instead of losing focus |
| **Bold / Italic** | `Cmd+B` wraps selection in `**bold**`, `Cmd+I` in `*italic*` |
| **Editable Filename** | Click the filename in the toolbar to rename |
| **Multiple Tabs** | Open several files simultaneously; each persists independently |
| **Welcome Page** | Opens with a comprehensive markdown reference (`example.md`) on every launch |
| **Close All Tabs** | Resets to a fresh welcome page |

---

## HTML Editing

Edit `.html` and `.htm` files with a live preview rendered in a sandboxed iframe.

| Feature | Detail |
|---------|--------|
| **Live Preview** | HTML is rendered in a sandboxed `<iframe>` with `allow-scripts allow-same-origin` |
| **New HTML File** | File > New HTML creates a boilerplate HTML document |
| **Open / Drag & Drop** | Open `.html`/`.htm` files via the file picker or by dragging onto the app |
| **Save / Save As** | File System Access API with correct MIME types for HTML |

---

## Customizable Accent Colors

Personalize the dark mode color scheme with the accent color picker in the toolbar.

| Feature | Detail |
|---------|--------|
| **8 Presets** | Blue, Purple, Green, Orange, Pink, Cyan, Red, Gold |
| **Custom HEX** | Enter any `#rrggbb` color code for a fully custom accent |
| **Auto Contrast** | Text color on accent backgrounds automatically switches between black and white |
| **Accent Elements** | H1/H2 headings, bold text, table headers, blockquote borders, horizontal rules, links, definition terms, and UI controls all follow the accent color |
| **Persisted** | Your choice is saved to `localStorage` and restored on next visit |

---

## Markdown Rendering

| Feature | Detail |
|---------|--------|
| **GitHub Flavored Markdown** | Full GFM support via `marked` |
| **Tables** | Pipe tables with accent-colored headers and left border accent strip |
| **Task Lists** | `- [x]` renders as tinted checkboxes matching the accent color |
| **Blockquotes** | Styled with accent left border |
| **Collapsible Sections** | `<details>` / `<summary>` with styled toggle |
| **Inline & Fenced Code** | Backtick and fenced blocks with background highlight |
| **Keyboard Keys** | `<kbd>` elements styled with key-cap appearance |
| **Definition Lists** | `Term` / `: definition` with accent-colored terms |
| **Line Breaks** | Single newlines produce `<br>` |
| **Auto-Linking** | Bare URLs become clickable links |

---

## Mermaid Diagrams

Wrap any Mermaid definition in a fenced ` ```mermaid ` block:

```
```mermaid
graph LR
    A[Input] --> B[Parser] --> C[Preview]
```
```

Supported diagram types include flowcharts, sequence diagrams, class diagrams, state machines, ER diagrams, Gantt charts, pie charts, mindmaps, and timelines.

Diagrams automatically switch between dark and light themes. Invalid syntax shows a descriptive error in place of the diagram rather than breaking the page.

---

## JSON & JSON5 Validation

Paste any JSON or JSON5 object or array into the editor and the preview pane switches into validation mode automatically.

| Behavior | Detail |
|----------|--------|
| **Auto-detection** | Activates when content starts with `{` or `[` |
| **Strict JSON** | Validated with the native `JSON.parse` |
| **JSON5 fallback** | If strict JSON fails, retried with the `json5` parser |
| **Formatted output** | Valid input is pretty-printed with 2-space indentation |
| **Error location** | Invalid input shows the exact line and column of the error |
| **Syntax coloring** | Keys, strings, numbers, booleans, and nulls each have distinct colors |
| **Line numbers** | Every line is numbered; the error line is highlighted in red |

---

## Syntax Highlighting

| Feature | Detail |
|---------|--------|
| **highlight.js** | 180+ languages with automatic detection |
| **Copy Button** | Every code block has a one-click Copy button |
| **Theme-Aware** | Follows dark/light mode with preview-specific backgrounds |

---

## Find & Replace

Open with `Cmd+F`.

| Feature | Detail |
|---------|--------|
| **Match Count** | Shows "X of Y" matches |
| **Navigate** | Next (`Enter`) / Previous (`Shift+Enter`) through all matches |
| **Replace** | Replace the current match, or Replace All at once |
| **Case Sensitive** | Toggle per-search |
| **Regex** | Toggle to search with regular expressions |
| **Close** | `Escape` dismisses the bar |

---

## Export

| Format | Detail |
|--------|--------|
| **PDF** | `Cmd+P` — generates a print-ready PDF via `html2pdf.js` with page-break hints |
| **HTML** | Standalone file with rendered markdown, Mermaid, syntax highlighting, and all styles embedded — no external dependencies |

---

## Share as URL

Encode the current document into a URL-safe base64 string. The recipient opens the link and sees the same content immediately. On supported browsers the native Web Share API is used.

---

## Reading Mode

Click the **Read** button in the toolbar to enter distraction-free reading mode.

| Setting | Detail |
|---------|--------|
| **Font Size** | Adjustable (persisted) |
| **Line Height** | Adjustable (persisted) |
| **Sepia Tone** | Optional warm background tint |
| **Centered Layout** | Max 800 px centered column |

---

## File Operations

| Feature | Detail |
|---------|--------|
| **Open** | `Cmd+O` — native file picker (`.md`, `.txt`, `.markdown`, `.html`, `.htm`) |
| **Save** | `Cmd+S` — writes to the existing file handle, or prompts Save As |
| **Save As** | `Shift+Cmd+S` — always prompts for a new file location |
| **Drag & Drop** | Drop a `.md`, `.txt`, or `.html` file onto the app to open it |
| **Multiple Tabs** | Each file stored independently in `localStorage` |
| **Auto-Save** | Content saved every 5 seconds; restored on next open |
| **File System Access API** | On supported browsers (Chrome, Edge), save directly to disk without re-downloading |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+F` | Toggle Find & Replace |
| `Cmd+D` | Toggle dark / light mode |
| `Cmd+S` | Save file |
| `Shift+Cmd+S` | Save As |
| `Cmd+O` | Open file |
| `Cmd+P` | Export PDF |
| `Cmd+E` | Cycle view mode (Split → Editor → Preview) |
| `Cmd+R` | Toggle reading mode |
| `Cmd+T` | New tab |
| `Cmd+B` | Bold selected text |
| `Cmd+I` | Italic selected text |
| `?` | Show keyboard shortcuts |
| `Escape` | Close find bar / dismiss modals |
| `Tab` | Insert 2 spaces |

---

## Dark Mode

| Feature | Detail |
|---------|--------|
| **GitHub-Dark Preview** | Preview pane uses GitHub's dark color palette (`#0d1117` background, `#c9d1d9` text) |
| **Accent Colors** | H1/H2 headings, bold text, table headers, blockquote borders, horizontal rules, links, and more follow the chosen accent color |
| **Custom HEX** | Enter any hex color for a fully personalized theme |
| **Light Mode** | Clean white theme with blue accents |
| **Toggle** | `Cmd+D` or the sun/moon button in the toolbar |

---

## Privacy

Every byte stays in your browser. Files are stored in `localStorage`. Nothing is uploaded, synced, or tracked. No accounts, no analytics, no backend.

---

## PWA / Offline

| Feature | Detail |
|---------|--------|
| **Offline Support** | Workbox service worker pre-caches all assets |
| **Install as App** | Add to Home Screen on any device for a native-app feel |
| **Auto-Update** | Service worker updates silently when a new version is deployed |
| **Works on iPad** | Stacked layout with swipe navigation, touch scrolling, and no iOS zoom |
| **Mobile Tab Bar** | Bottom navigation bar on mobile for switching between Editor, Split, and Preview |

---

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| State | Zustand 5 (persisted to localStorage) |
| Markdown | marked v17 |
| Diagrams | Mermaid v11 |
| Syntax Highlighting | highlight.js v11 |
| JSON5 | json5 |
| Sanitization | DOMPurify |
| PDF | html2pdf.js |
| PWA | vite-plugin-pwa + Workbox |
