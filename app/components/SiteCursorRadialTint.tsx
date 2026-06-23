'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Radial teal tint that follows the pointer for subtle interactivity.
 * Shared across the landing page shell and inner site pages.
 */
export function SiteCursorRadialTint() {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const pendingCoords = useRef<{ x: number; y: number } | null>(null)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; active: boolean }>>([])
  const RIPPLE_SIZE = 360
  const RIPPLE_DURATION = 650

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    const applyCoords = () => {
      if (!overlayRef.current || !pendingCoords.current) return
      const { x, y } = pendingCoords.current
      overlayRef.current.style.setProperty('--glow-x', `${x}px`)
      overlayRef.current.style.setProperty('--glow-y', `${y}px`)
      pendingCoords.current = null
      frameRef.current = null
    }

    const requestApply = () => {
      if (frameRef.current !== null) return
      frameRef.current = requestAnimationFrame(applyCoords)
    }

    const handlePointerMove = (event: PointerEvent) => {
      pendingCoords.current = { x: event.clientX, y: event.clientY }
      requestApply()
    }

    const handlePointerDown = (event: PointerEvent) => {
      const x = event.clientX
      const y = event.clientY
      const id = Date.now() + Math.random()

      setRipples((prev) => {
        const next = [...prev.slice(-4), { id, x, y, active: false }]

        requestAnimationFrame(() => {
          setRipples((current) =>
            current.map((ripple) =>
              ripple.id === id ? { ...ripple, active: true } : ripple,
            ),
          )
        })

        setTimeout(() => {
          setRipples((current) => current.filter((ripple) => ripple.id !== id))
        }, RIPPLE_DURATION)

        return next
      })
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      style={
        {
          '--glow-x': '50%',
          '--glow-y': '50%',
          background:
            'radial-gradient(260px 260px at var(--glow-x) var(--glow-y), rgba(6,182,212,0.32), rgba(6,182,212,0) 60%)',
          mixBlendMode: 'screen',
        } as React.CSSProperties
      }
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute block rounded-full pointer-events-none"
          style={{
            left: ripple.x - RIPPLE_SIZE / 2,
            top: ripple.y - RIPPLE_SIZE / 2,
            width: RIPPLE_SIZE,
            height: RIPPLE_SIZE,
            background:
              'radial-gradient(circle, rgba(6,182,212,0.35), rgba(6,182,212,0))',
            transform: ripple.active ? 'scale(2.4)' : 'scale(0.35)',
            opacity: ripple.active ? 0 : 0.55,
            transition: `transform ${RIPPLE_DURATION}ms ease-out, opacity ${RIPPLE_DURATION}ms ease-out`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  )
}
