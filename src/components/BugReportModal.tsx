import React, { useState } from 'react'

const GITHUB_ISSUES_URL = 'https://github.com/marketingbull/md-preview-pwa/issues/new'

interface BugReportModalProps {
  visible: boolean
  onClose: () => void
  screenshot: string | null
}

export const BugReportModal: React.FC<BugReportModalProps> = ({ visible, onClose, screenshot }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    if (screenshot) {
      const a = document.createElement('a')
      a.href = screenshot
      a.download = `bug-report-${Date.now()}.png`
      a.click()
    }

    const body = [
      description || '(no description provided)',
      '',
      '---',
      `**User Agent:** ${navigator.userAgent}`,
      `**Date:** ${new Date().toISOString()}`,
      '',
      screenshot
        ? '_A screenshot was auto-downloaded — please attach the PNG file to this issue._'
        : '_No screenshot available._',
    ].join('\n')

    const params = new URLSearchParams({ title: title || 'Bug report', body, labels: 'bug' })
    window.open(`${GITHUB_ISSUES_URL}?${params.toString()}`, '_blank', 'noopener')
    onClose()
  }

  return (
    <div className={`shortcuts-overlay${visible ? ' visible' : ''}`} onClick={onClose}>
      <div className="shortcuts-modal bug-report-modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 6px' }}>🐛 Report a Bug</h3>
        <p className="bug-report-subtitle">
          A screenshot of the current state will download automatically. Attach it to the GitHub issue after it opens.
        </p>

        <div className="bug-report-field">
          <label>Title</label>
          <input
            type="text"
            className="bug-report-input"
            placeholder="Short description of the issue"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        <div className="bug-report-field">
          <label>Description / Steps to reproduce</label>
          <textarea
            className="bug-report-textarea"
            placeholder={'1. Open a file\n2. ...'}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        {screenshot && (
          <div className="bug-report-screenshot-section">
            <label>Screenshot preview</label>
            <img src={screenshot} alt="App screenshot" className="bug-report-screenshot-preview" />
          </div>
        )}

        <div className="bug-report-actions">
          <button className="bug-report-cancel" onClick={onClose}>Cancel</button>
          <button className="bug-report-submit" onClick={handleSubmit}>
            {screenshot ? 'Download Screenshot & Open GitHub →' : 'Open GitHub Issues →'}
          </button>
        </div>
      </div>
    </div>
  )
}
