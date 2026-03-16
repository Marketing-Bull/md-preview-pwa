import React, { useMemo } from 'react'
import type { JsonValidationResult } from '../hooks/useJsonValidator'

interface JsonPreviewProps {
  result: JsonValidationResult
  rawContent: string
}

export const JsonPreview: React.FC<JsonPreviewProps> = ({ result, rawContent }) => {
  const lines = useMemo(() => (result.formatted ?? rawContent).split('\n'), [result, rawContent])
  const errorLine = result.error?.line ?? 0

  // Highlight JSON syntax in a line
  const colorize = (text: string) =>
    text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (match) => {
          let cls = 'json-number'
          if (/^"/.test(match)) cls = /:$/.test(match) ? 'json-key' : 'json-string'
          else if (/true|false/.test(match)) cls = 'json-bool'
          else if (/null/.test(match)) cls = 'json-null'
          return `<span class="${cls}">${match}</span>`
        })

  return (
    <div className="json-preview">
      {/* Header bar */}
      <div className="json-preview-header">
        {result.isValid ? (
          <span className="json-badge json-badge-ok">
            ✅ Valid {result.isJson5 ? 'JSON5' : 'JSON'}
          </span>
        ) : (
          <span className="json-badge json-badge-err">
            ❌ Invalid JSON
          </span>
        )}
        {result.isJson5 && (
          <span className="json-hint">Parsed as JSON5 — not strict JSON</span>
        )}
        {result.error && (
          <span className="json-error-loc">
            Line {result.error.line}, Col {result.error.col}
          </span>
        )}
      </div>

      {/* Error message */}
      {result.error && (
        <div className="json-error-msg">
          {result.error.message.replace(/^JSON5:\s*/i, '')}
        </div>
      )}

      {/* Code view with line numbers */}
      <div className="json-code-wrap">
        <table className="json-lines">
          <tbody>
            {lines.map((line, i) => {
              const lineNum = i + 1
              const isErr = errorLine > 0 && lineNum === errorLine
              return (
                <tr key={i} className={isErr ? 'json-line-error' : ''}>
                  <td className="json-lineno">{lineNum}</td>
                  <td
                    className="json-linetext"
                    dangerouslySetInnerHTML={{ __html: colorize(line) || '&nbsp;' }}
                  />
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
