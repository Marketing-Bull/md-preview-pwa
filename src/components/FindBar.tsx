import React, { useRef, useEffect } from 'react'
import { useStore } from '../store'

interface FindBarProps {
  visible: boolean
  matchCount: number
  currentMatch: number
  onClose: () => void
  onFind: (query: string, caseSensitive: boolean, useRegex: boolean) => void
  onNext: () => void
  onPrev: () => void
  onReplace: (replaceText: string) => void
  onReplaceAll: (replaceText: string) => void
}

export const FindBar: React.FC<FindBarProps> = ({
  visible,
  matchCount,
  currentMatch,
  onClose,
  onFind,
  onNext,
  onPrev,
  onReplace,
  onReplaceAll,
}) => {
  const {
    findQuery,
    setFindQuery,
    replaceQuery,
    setReplaceQuery,
    findCaseSensitive,
    setFindCaseSensitive,
    findRegex,
    setFindRegex,
  } = useStore()

  const findInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (visible && findInputRef.current) {
      findInputRef.current.focus()
    }
  }, [visible])

  const handleFindChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value
    setFindQuery(query)
    onFind(query, findCaseSensitive, findRegex)
  }

  const handleFindKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.shiftKey ? onPrev() : onNext()
    }
  }

  const handleReplaceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onReplace(replaceQuery)
    }
  }

  return (
    <div className={`find-bar ${visible ? 'visible' : ''}`}>
      <input
        ref={findInputRef}
        type="text"
        placeholder="Find..."
        value={findQuery}
        onChange={handleFindChange}
        onKeyDown={handleFindKeyDown}
      />
      <span className="find-info">
        {findQuery
          ? matchCount > 0
            ? `${currentMatch + 1} of ${matchCount}`
            : 'No matches'
          : ''}
      </span>
      <button onClick={onPrev} title="Previous (Shift+Enter)">
        ▲
      </button>
      <button onClick={onNext} title="Next (Enter)">
        ▼
      </button>
      <label>
        <input
          type="checkbox"
          checked={findCaseSensitive}
          onChange={(e) => {
            setFindCaseSensitive(e.currentTarget.checked)
            onFind(findQuery, e.currentTarget.checked, findRegex)
          }}
        />
        Aa
      </label>
      <label>
        <input
          type="checkbox"
          checked={findRegex}
          onChange={(e) => {
            setFindRegex(e.currentTarget.checked)
            onFind(findQuery, findCaseSensitive, e.currentTarget.checked)
          }}
        />
        .*
      </label>
      <span className="separator"></span>
      <input
        ref={replaceInputRef}
        type="text"
        placeholder="Replace..."
        value={replaceQuery}
        onChange={(e) => setReplaceQuery(e.currentTarget.value)}
        onKeyDown={handleReplaceKeyDown}
      />
      <button onClick={() => onReplace(replaceQuery)}>Replace</button>
      <button onClick={() => onReplaceAll(replaceQuery)} style={{ color: 'var(--accent)' }}>
        Replace All
      </button>
      <span className="spacer"></span>
      <button onClick={onClose}>✕</button>
    </div>
  )
}
