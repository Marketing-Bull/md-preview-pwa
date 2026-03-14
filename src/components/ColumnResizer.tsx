import React, { useRef, useEffect } from 'react'
import { useStore } from '../store'

export const ColumnResizer: React.FC = () => {
  const { columnRatio, setColumnRatio } = useStore()
  const isDraggingRef = useRef(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return

      const container = document.querySelector('.main-container')
      if (!container) return

      const rect = container.getBoundingClientRect()
      const newRatio = (e.clientX - rect.left) / rect.width

      // Constrain between 20% and 80%
      const constrainedRatio = Math.max(0.2, Math.min(0.8, newRatio))
      setColumnRatio(constrainedRatio)
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [setColumnRatio])

  const handleMouseDown = () => {
    isDraggingRef.current = true
  }

  return (
    <div
      className="column-resizer"
      onMouseDown={handleMouseDown}
      style={{
        left: `${columnRatio * 100}%`,
      }}
    />
  )
}
