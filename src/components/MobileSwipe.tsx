import React, { useRef, useEffect } from 'react'
import { useStore } from '../store'

interface MobileSwipeProps {
  children: React.ReactNode
}

export const MobileSwipe: React.FC<MobileSwipeProps> = ({ children }) => {
  const { viewMode, setViewMode } = useStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
      setIsTransitioning(false)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY

      const deltaX = touchEndX - touchStartX.current
      const deltaY = touchEndY - touchStartY.current

      // Only handle horizontal swipes (ignore vertical scrolling)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        setIsTransitioning(true)

        const modes: Array<'split' | 'editor' | 'preview'> = ['editor', 'split', 'preview']
        const currentIndex = modes.indexOf(viewMode)

        if (deltaX > 0) {
          // Swipe right: previous view
          const nextIndex = (currentIndex - 1 + modes.length) % modes.length
          setViewMode(modes[nextIndex])
        } else {
          // Swipe left: next view
          const nextIndex = (currentIndex + 1) % modes.length
          setViewMode(modes[nextIndex])
        }
      }
    }

    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [viewMode, setViewMode])

  const modeIndex = ['editor', 'split', 'preview'].indexOf(viewMode)
  const translateX = -modeIndex * 33.333

  return (
    <div
      ref={containerRef}
      className="mobile-swipe-wrapper"
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '300%',
          height: '100%',
          transition: isTransitioning ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          transform: `translateX(${translateX}%)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
