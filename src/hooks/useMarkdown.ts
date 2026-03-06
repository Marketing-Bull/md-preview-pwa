import { useEffect, useRef, useState } from 'react'
import { marked, Renderer } from 'marked'
import mermaid from 'mermaid'
import hljs from 'highlight.js'

interface RenderResult {
  html: string
  headings: Array<{ level: number; text: string; id: string }>
}

let mermaidCounter = 0

export const useMarkdown = (content: string, isDarkMode: boolean): RenderResult => {
  const [result, setResult] = useState<RenderResult>({ html: '', headings: [] })
  const renderTimeoutRef = useRef<NodeJS.Timeout>()
  const highlightThemeRef = useRef<'dark' | 'light'>(isDarkMode ? 'dark' : 'light')

  useEffect(() => {
    highlightThemeRef.current = isDarkMode ? 'dark' : 'light'
  }, [isDarkMode])

  useEffect(() => {
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current)
    }

    renderTimeoutRef.current = setTimeout(async () => {
      try {
        // Custom renderer for mermaid blocks and code copy buttons
        const renderer: Partial<Renderer> = {
          code(token: any) {
            const { text, lang } = token
            if (lang === 'mermaid') {
              return `<div class="mermaid">${text}</div>`
            }

            const highlighted = lang && hljs.getLanguage(lang)
              ? hljs.highlight(text, { language: lang }).value
              : hljs.highlightAuto(text).value

            return `<pre><code class="hljs language-${lang || ''}">${highlighted}</code></pre>`
          },

          listitem(token: any) {
            const { text, task, checked } = token
            if (task) {
              return `<li style="list-style:none;margin-left:-1.5em"><input type="checkbox" disabled ${checked ? 'checked' : ''}>${text}</li>\n`
            }
            return `<li>${text}</li>\n`
          },
        }

        // Configure marked with custom renderer and options
        marked.use({
          renderer: renderer as Renderer,
          breaks: true,
          gfm: true,
          async: false,
        } as any)

        // Initialize mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: isDarkMode ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: '-apple-system, sans-serif',
        })

        // Render markdown
        const html = await marked.parse(content)

        // Create a temporary container to parse HTML
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = html

        // Extract headings
        const headings: Array<{ level: number; text: string; id: string }> = []
        const headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')
        headingElements.forEach((heading, index) => {
          const level = parseInt(heading.tagName.charAt(1))
          const text = heading.textContent || ''
          const id = `heading-${index}`
          headings.push({ level, text, id })
        })

        // Render mermaid diagrams
        const mermaidEls = tempDiv.querySelectorAll('.mermaid')
        for (const el of mermaidEls) {
          try {
            const id = `mermaid-${++mermaidCounter}`
            const { svg } = await mermaid.render(id, el.textContent || '')
            el.innerHTML = svg
          } catch (e) {
            el.innerHTML = `<pre style="color:red;font-size:12px">Mermaid error: ${e instanceof Error ? e.message : 'Unknown error'}</pre>`
          }
        }

        const finalHtml = tempDiv.innerHTML

        setResult({
          html: finalHtml,
          headings,
        })
      } catch (error) {
        console.error('Markdown render error:', error)
        setResult({
          html: `<p style="color: red;">Error rendering markdown: ${error instanceof Error ? error.message : 'Unknown error'}</p>`,
          headings: [],
        })
      }
    }, 150)

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current)
      }
    }
  }, [content, isDarkMode])

  return result
}
