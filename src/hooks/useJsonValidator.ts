import { useMemo } from 'react'
import JSON5 from 'json5'

export interface JsonError {
  message: string
  line: number
  col: number
}

export interface JsonValidationResult {
  isJson: boolean
  isValid: boolean
  isJson5: boolean          // valid only as JSON5 (not strict JSON)
  formatted: string | null
  error: JsonError | null
}

function extractLineCol(err: unknown): { line: number; col: number } {
  const msg = err instanceof Error ? err.message : String(err)
  // JSON5 errors: "JSON5: invalid character 'x' at 3:7"
  const json5Match = msg.match(/at\s+(\d+):(\d+)/)
  if (json5Match) return { line: parseInt(json5Match[1]), col: parseInt(json5Match[2]) }
  // Native JSON errors (V8): "at position 42" — convert offset to line:col
  const posMatch = msg.match(/position\s+(\d+)/)
  if (posMatch) return { line: 0, col: parseInt(posMatch[1]) }
  return { line: 0, col: 0 }
}

function looksLikeJson(text: string): boolean {
  const t = text.trim()
  return t.startsWith('{') || t.startsWith('[')
}

export function useJsonValidator(content: string): JsonValidationResult {
  return useMemo(() => {
    if (!looksLikeJson(content)) {
      return { isJson: false, isValid: false, isJson5: false, formatted: null, error: null }
    }

    // Try strict JSON first
    try {
      const parsed = JSON.parse(content)
      return {
        isJson: true,
        isValid: true,
        isJson5: false,
        formatted: JSON.stringify(parsed, null, 2),
        error: null,
      }
    } catch (strictErr) {
      // Try JSON5
      try {
        const parsed = JSON5.parse(content)
        return {
          isJson: true,
          isValid: true,
          isJson5: true,
          formatted: JSON.stringify(parsed, null, 2),
          error: null,
        }
      } catch (json5Err) {
        // Report the JSON5 error (more informative line/col)
        const { line, col } = extractLineCol(json5Err)
        const msg = json5Err instanceof Error ? json5Err.message : String(json5Err)
        return {
          isJson: true,
          isValid: false,
          isJson5: false,
          formatted: null,
          error: { message: msg, line, col },
        }
      }
    }
  }, [content])
}
