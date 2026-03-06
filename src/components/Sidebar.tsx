import React, { useState, useEffect } from 'react'

interface Heading {
  level: number
  text: string
  id: string
}

interface SidebarProps {
  headings: Heading[]
}

export const Sidebar: React.FC<SidebarProps> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        threshold: [0.1, 0.9],
        rootMargin: '-20px 0px -80% 0px',
      }
    )

    // Observe all headings in the preview
    const previewContent = document.querySelector('.preview-content')
    if (previewContent) {
      const headingElements = previewContent.querySelectorAll('h1, h2, h3, h4, h5, h6')
      headingElements.forEach((el) => {
        if (el.id) observer.observe(el)
      })
    }

    return () => observer.disconnect()
  }, [headings])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">Table of Contents</div>
      <div className="sidebar-content">
        {headings.length === 0 ? (
          <div style={{ padding: '16px', color: 'var(--text-dim)', fontSize: '13px', textAlign: 'center' }}>
            No headings found
          </div>
        ) : (
          headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`toc-item level-${heading.level} ${activeId === heading.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                handleClick(heading.id)
              }}
            >
              {heading.text}
            </a>
          ))
        )}
      </div>
    </div>
  )
}
