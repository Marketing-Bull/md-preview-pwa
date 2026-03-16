declare const html2pdf: any

const RECENT_FILES_KEY = 'recent_files_list'
const MAX_RECENT_FILES = 10

interface RecentFile {
  name: string
  handle?: FileSystemFileHandle
  timestamp: number
}

const addToRecentFiles = (fileName: string) => {
  try {
    const recent: RecentFile[] = JSON.parse(localStorage.getItem(RECENT_FILES_KEY) || '[]')
    // Remove duplicates
    const filtered = recent.filter((f) => f.name !== fileName)
    // Add new file to front
    const newRecent: RecentFile[] = [{ name: fileName, timestamp: Date.now() }, ...filtered].slice(0, MAX_RECENT_FILES)
    localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(newRecent))
  } catch (error) {
    console.error('Error updating recent files:', error)
  }
}

export const getRecentFiles = (): RecentFile[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_FILES_KEY) || '[]')
  } catch {
    return []
  }
}

const fallbackOpenFile = (): Promise<{ content: string; fileName: string } | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.markdown,.txt'

    input.onchange = async (e: any) => {
      const file = e.target.files?.[0]
      if (!file) {
        resolve(null)
        return
      }

      try {
        const content = await file.text()
        const fileName = file.name
        addToRecentFiles(fileName)
        resolve({ content, fileName })
      } catch (error) {
        console.error('Error reading file:', error)
        resolve(null)
      }
    }

    input.click()
  })
}

export const openFile = async (): Promise<{ content: string; fileName: string; handle?: FileSystemFileHandle } | null> => {
  // Try File System Access API first
  if ('showOpenFilePicker' in window) {
    try {
      const handles = await (window as any).showOpenFilePicker({
        types: [
          {
            description: 'Markdown & Text Files',
            accept: { 'text/markdown': ['.md', '.markdown'], 'text/plain': ['.txt'] },
          },
        ],
      })

      if (!handles || handles.length === 0) return null

      const handle = handles[0] as FileSystemFileHandle
      const file = await handle.getFile()
      const content = await file.text()
      const fileName = file.name

      addToRecentFiles(fileName)
      return { content, fileName, handle }
    } catch (error) {
      // User cancelled the picker — don't fall through to the legacy picker
      if ((error as Error).name === 'AbortError') return null
      console.error('File System Access API error:', error)
      return fallbackOpenFile()
    }
  } else {
    // Fallback for browsers without File System Access API (Safari, iPad)
    return fallbackOpenFile()
  }
}

export const saveFile = (content: string, fileName: string) => {
  const element = document.createElement('a')
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`)
  element.setAttribute('download', fileName || 'document.md')
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export const exportPDF = (html: string, fileName: string) => {
  if (typeof html2pdf === 'undefined') {
    console.error('html2pdf library not loaded')
    return
  }

  const element = document.createElement('div')
  element.innerHTML = html
  element.style.padding = '20px'
  element.style.fontFamily = 'system-ui, -apple-system, sans-serif'
  element.style.lineHeight = '1.6'
  element.style.color = '#000'
  element.style.backgroundColor = '#fff'

  // Style headings
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6')
  headings.forEach((h) => {
    ;(h as HTMLElement).style.marginTop = '0.5em'
    ;(h as HTMLElement).style.marginBottom = '0.5em'
  })

  // Style code blocks
  const codeBlocks = element.querySelectorAll('pre')
  codeBlocks.forEach((block) => {
    ;(block as HTMLElement).style.backgroundColor = '#f5f5f5'
    ;(block as HTMLElement).style.padding = '12px'
    ;(block as HTMLElement).style.borderRadius = '4px'
    ;(block as HTMLElement).style.overflow = 'auto'
  })

  const opt = {
    margin: 10,
    filename: fileName.replace(/\.[^/.]+$/, '') + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
  }

  html2pdf().set(opt).from(element).save()
}

// CSS for syntax highlighting (Atom One Light theme) - embedded to avoid external dependency
const HIGHLIGHT_CSS = `
.hljs{color:#383a42;background:#fafafa}.hljs-attr{color:#e45649}.hljs-attr-value{color:#50a14f}.hljs-attr-string{color:#50a14f}.hljs-bold{font-weight:700}.hljs-bullet{color:#4078f2}.hljs-class{color:#c18401}.hljs-code{color:#50a14f}.hljs-comment{color:#a0a1a7;font-style:italic}.hljs-deletion{background-color:#fbe5e5;color:#c91e1e}.hljs-doctag{color:#e45649}.hljs-emphasis{font-style:italic}.hljs-formula{color:#4078f2}.hljs-function .hljs-attr{color:#e45649}.hljs-function .hljs-keyword{color:#a626a4}.hljs-function .hljs-params{color:#383a42}.hljs-function .hljs-punctuation{color:#383a42}.hljs-function .hljs-string{color:#50a14f}.hljs-function .hljs-title{color:#4078f2}.hljs-function-params{color:#383a42}.hljs-highlight{background-color:#ffe69c;color:#383a42}.hljs-insertion{background-color:#e5f1e5;color:#50a14f}.hljs-keyword{color:#a626a4}.hljs-literal{color:#0184bc}.hljs-meta{color:#4078f2}.hljs-meta-keyword{color:#a626a4}.hljs-meta-string{color:#50a14f}.hljs-name{color:#e45649}.hljs-number{color:#986801}.hljs-operator{color:#383a42}.hljs-operator-char{color:#383a42}.hljs-params{color:#383a42}.hljs-property{color:#383a42}.hljs-punctuation{color:#383a42}.hljs-quote{color:#a0a1a7;font-style:italic}.hljs-regexp{color:#0184bc}.hljs-rsl{color:#50a14f}.hljs-selector-attr{color:#e45649}.hljs-selector-class{color:#c18401}.hljs-selector-id{color:#4078f2}.hljs-selector-pseudo{color:#a626a4}.hljs-selector-tag{color:#e45649}.hljs-string{color:#50a14f}.hljs-strong{font-weight:700}.hljs-subst{color:#383a42}.hljs-symbol{color:#e45649}.hljs-tag{color:#e45649}.hljs-tag-attr{color:#e45649}.hljs-tag-name{color:#e45649}.hljs-tag-punctuation{color:#383a42}.hljs-template-string{color:#50a14f}.hljs-title{color:#4078f2}.hljs-type{color:#c18401}.hljs-variable{color:#e45649}
`

export const exportHTML = (html: string, fileName: string) => {
  const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>
    /* Syntax highlighting (Atom One Light) */
    ${HIGHLIGHT_CSS}
  </style>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.min.js"><\/script>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
      background: #fff;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.2em;
      margin-bottom: 0.6em;
      font-weight: 600;
    }
    h1 {
      font-size: 2em;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 0.3em;
    }
    h2 {
      font-size: 1.6em;
    }
    h3 {
      font-size: 1.3em;
    }
    pre {
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
      padding: 12px;
      border-radius: 6px;
      overflow: auto;
      line-height: 1.4;
    }
    code {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.9em;
    }
    pre code {
      background: none;
      padding: 0;
      color: inherit;
    }
    p code {
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 3px;
    }
    blockquote {
      border-left: 4px solid #4da6ff;
      margin: 1em 0;
      padding-left: 16px;
      color: #666;
      font-style: italic;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1.5em 0;
      border: 1px solid #ddd;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background: #f9f9f9;
      font-weight: bold;
      border-bottom: 2px solid #ddd;
    }
    tr:nth-child(even) {
      background: #fafafa;
    }
    img {
      max-width: 100%;
      height: auto;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      margin: 1em 0;
    }
    a {
      color: #0066cc;
      text-decoration: none;
      border-bottom: 1px dotted #0066cc;
    }
    a:hover {
      text-decoration: underline;
    }
    .mermaid {
      display: flex;
      justify-content: center;
      margin: 1.5em 0;
    }
    ul, ol {
      margin: 1em 0;
      padding-left: 2em;
    }
    li {
      margin: 0.5em 0;
    }
    strong {
      font-weight: 600;
    }
    em {
      font-style: italic;
    }
    hr {
      border: none;
      border-top: 2px solid #e0e0e0;
      margin: 2em 0;
    }
    /* Print styles */
    @media print {
      body {
        max-width: 100%;
        padding: 0;
      }
      a {
        border-bottom: none;
      }
      a[href]:after {
        content: " (" attr(href) ")";
        font-size: 0.8em;
      }
    }
  </style>
</head>
<body>
  ${html}
  <script>
    // Initialize Mermaid diagrams
    mermaid.initialize({ startOnLoad: true, theme: 'default' });
    mermaid.contentLoaded();
  </script>
</body>
</html>`

  const element = document.createElement('a')
  element.setAttribute('href', `data:text/html;charset=utf-8,${encodeURIComponent(htmlDocument)}`)
  element.setAttribute('download', fileName.replace(/\.[^/.]+$/, '') + '.html')
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
