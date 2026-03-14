import { useEffect } from 'react'
import { useStore } from '../store'

export const useHighlightTheme = () => {
  const { highlightTheme } = useStore()

  useEffect(() => {
    const themeMap: Record<string, string> = {
      github: 'github',
      'github-dark': 'github-dark',
      monokai: 'monokai',
      dracula: 'dracula',
      'solarized-dark': 'solarized-dark',
      'atom-one-dark': 'atom-one-dark',
      'vs-light': 'vs',
    }

    const themeName = themeMap[highlightTheme] || 'atom-one-dark'
    const styleId = 'highlight-theme-style'
    let styleEl = document.getElementById(styleId) as HTMLLinkElement | null

    if (!styleEl) {
      styleEl = document.createElement('link')
      styleEl.id = styleId
      styleEl.rel = 'stylesheet'
      document.head.appendChild(styleEl)
    }

    styleEl.href = `https://cdn.jsdelivr.net/npm/highlight.js@11.10.0/styles/${themeName}.min.css`
  }, [highlightTheme])
}
