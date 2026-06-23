'use client'

import { useEffect, useId, useRef, useState } from 'react'

interface MermaidDiagramProps {
  chart: string
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const id = useId().replace(/:/g, '')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function renderDiagram() {
      if (!containerRef.current) return

      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'strict',
          fontFamily: 'var(--font-geist-sans), sans-serif',
        })

        const { svg } = await mermaid.render(`mermaid-${id}`, chart.trim())
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram')
        }
      }
    }

    void renderDiagram()

    return () => {
      cancelled = true
    }
  }, [chart, id])

  if (error) {
    return (
      <div className="my-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4">
        <p className="text-sm text-destructive mb-2">Could not render Mermaid diagram.</p>
        <pre className="overflow-x-auto text-xs font-mono text-muted-foreground whitespace-pre-wrap">
          {chart}
        </pre>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="my-6 overflow-x-auto rounded-lg border border-border bg-card/50 p-4 [&_svg]:mx-auto"
      aria-label="Diagram"
    />
  )
}
