'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Services', href: '/services' },
  { name: 'Articles', href: '/articles' },
  { name: 'Work', href: '/#work' },
  { name: 'Contact', href: '/contact' },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/articles') {
    return pathname === '/articles' || pathname.startsWith('/articles/')
  }
  if (href === '/services') {
    return pathname === '/services' || pathname.startsWith('/services/')
  }
  if (href === '/contact') {
    return pathname === '/contact'
  }
  return false
}

export function SiteNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const linkClass = (href: string) =>
    cn(
      'hover:text-cyan-400 hover:scale-150 transition-all duration-300 ease-in-out',
      isActive(pathname, href) ? 'text-cyan-400' : '',
    )

  return (
    <nav className="fixed top-0 w-full z-40 border-b border-white/5 bg-black/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="tracking-widest text-lg text-white hover:text-cyan-400 hover:scale-150 transition-all duration-300 ease-in-out flex items-center gap-1"
        >
          Dane<span className="text-cyan-500">jw</span>
        </Link>

        <div className="hidden md:flex gap-8 text-xs font-medium tracking-widest uppercase text-slate-300">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className={linkClass(item.href)}>
              {item.name}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="md:hidden text-white hover:text-cyan-400 hover:scale-150 transition-all duration-300 ease-in-out"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor">
            <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          mobileMenuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="px-6 py-4 flex flex-col gap-4 text-xs font-medium tracking-widest uppercase text-slate-300 border-t border-white/5">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn('hover:text-cyan-400 transition-all duration-300 ease-in-out origin-left', linkClass(item.href))}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
