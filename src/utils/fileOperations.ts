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

export const openFile = async (): Promise<{ content: string; fileName: string } | null> => {
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

      const file = await handles[0].getFile()
      const content = await file.text()
      const fileName = file.name

      addToRecentFiles(fileName)
      return { content, fileName }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('File System Access API error:', error)
      }
      // Fall back to input element
      return fallbackOpenFile()
    }
  } else {
    // Fallback for browsers without File System Access API
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

export const exportHTML = (html: string, fileName: string) => {
  const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>
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
      margin-top: 0.5em;
      margin-bottom: 0.5em;
    }
    pre {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      overflow: auto;
    }
    code {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.9em;
    }
    pre code {
      background: none;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #ddd;
      margin: 0;
      padding-left: 16px;
      color: #666;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background: #f9f9f9;
      font-weight: bold;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    a {
      color: #0066cc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .mermaid {
      display: flex;
      justify-content: center;
      margin: 1em 0;
    }
  </style>
</head>
<body>
  ${html}
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
