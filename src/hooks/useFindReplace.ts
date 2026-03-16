import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { useStore } from '../store'

interface Match {
  start: number
  end: number
}

interface UseFindReplaceResult {
  matches: Match[]
  currentIndex: number
  matchCount: number
  findNext: () => void
  findPrev: () => void
  doReplace: (replaceText: string) => void
  doReplaceAll: (replaceText: string) => void
  doFind: (content: string) => void
}

export const useFindReplace = (content: string): UseFindReplaceResult => {
  const { findQuery, findCaseSensitive, findRegex, setContent } = useStore()

  // Track current match index as mutable ref (no re-render on nav) + state for display
  const currentIndexRef = useRef(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const buildRegex = useCallback((query: string, caseSensitive: boolean, useRegex: boolean): RegExp | null => {
    if (!query) return null
    const flags = caseSensitive ? 'g' : 'gi'
    try {
      return useRegex ? new RegExp(query, flags) : new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags)
    } catch {
      return null
    }
  }, [])

  const matches = useMemo<Match[]>(() => {
    if (!findQuery) return []

    const regex = buildRegex(findQuery, findCaseSensitive, findRegex)
    if (!regex) return []

    const foundMatches: Match[] = []
    let m
    while ((m = regex.exec(content)) !== null) {
      foundMatches.push({ start: m.index, end: m.index + m[0].length })
      if (regex.lastIndex === m.index) regex.lastIndex++
    }

    return foundMatches
  }, [content, findQuery, findCaseSensitive, findRegex, buildRegex])

  // Reset to first match whenever the match list changes (new query/content).
  // Do NOT call selectMatch here — it steals focus from the find input.
  useEffect(() => {
    currentIndexRef.current = 0
    setCurrentIndex(0)
  }, [matches])

  const selectMatch = useCallback((index: number) => {
    if (index < 0 || index >= matches.length) return

    const editor = document.querySelector('textarea') as HTMLTextAreaElement
    if (!editor) return

    const m = matches[index]
    editor.focus()
    editor.setSelectionRange(m.start, m.end)

    const linesBefore = editor.value.substring(0, m.start).split('\n').length
    const lineHeight = parseFloat(getComputedStyle(editor).lineHeight) || 24
    editor.scrollTop = Math.max(0, (linesBefore - 3) * lineHeight)
  }, [matches])

  const doFind = useCallback(() => {
    // Finding is handled in the useMemo above
  }, [])

  const findNext = useCallback(() => {
    if (matches.length === 0) return
    const next = (currentIndexRef.current + 1) % matches.length
    currentIndexRef.current = next
    setCurrentIndex(next)
    selectMatch(next)
  }, [matches, selectMatch])

  const findPrev = useCallback(() => {
    if (matches.length === 0) return
    const prev = (currentIndexRef.current - 1 + matches.length) % matches.length
    currentIndexRef.current = prev
    setCurrentIndex(prev)
    selectMatch(prev)
  }, [matches, selectMatch])

  const doReplace = useCallback(
    (replaceText: string) => {
      if (matches.length === 0) return
      const idx = currentIndexRef.current
      if (idx < 0 || idx >= matches.length) return

      const m = matches[idx]
      const newContent = content.substring(0, m.start) + replaceText + content.substring(m.end)
      setContent(newContent)
      // Stay at same index; matches will recompute and reset
    },
    [matches, content, setContent]
  )

  const doReplaceAll = useCallback(
    (replaceText: string) => {
      if (!findQuery) return

      const regex = buildRegex(findQuery, findCaseSensitive, findRegex)
      if (!regex) return

      const newContent = content.replace(regex, replaceText)
      setContent(newContent)
    },
    [findQuery, findCaseSensitive, findRegex, content, buildRegex, setContent]
  )

  return {
    matches,
    currentIndex,
    matchCount: matches.length,
    findNext,
    findPrev,
    doReplace,
    doReplaceAll,
    doFind,
  }
}
