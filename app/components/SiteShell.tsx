'use client'

import { CustomCursor } from '@/app/components/CustomCursor'
import { SiteCursorRadialTint } from '@/app/components/SiteCursorRadialTint'
import { SiteFooter } from '@/app/components/SiteFooter'
import { SiteNav } from '@/app/components/SiteNav'

interface SiteShellProps {
  children: React.ReactNode
}

/**
 * Shared page shell matching the landing page visual system:
 * dark void background, dot grid, scanlines, cyan cursor tint, and site nav.
 */
export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="antialiased text-slate-300 selection:bg-cyan-500 selection:text-black relative bg-[#030303] min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="fixed inset-0 scanlines pointer-events-none h-screen w-screen z-20" />
      <div className="fixed inset-0 dot-grid-tight pointer-events-none h-screen w-screen z-0 opacity-50" />
      <SiteCursorRadialTint />
      <CustomCursor />
      <div className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full bg-void opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.08),transparent_40%)] opacity-25" />
      </div>

      <SiteNav />

      <main className="relative z-10 pt-24 pb-12">{children}</main>

      <SiteFooter />
    </div>
  )
}
