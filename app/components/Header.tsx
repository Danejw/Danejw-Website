'use client'

import { type FC, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Articles', href: '/articles' },
  { name: 'Contact', href: '/contact' },
]

export const Header: FC = () => {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="relative z-20 border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-12 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:bg-accent transition-colors">
              <span className="text-primary-foreground font-bold text-lg group-hover:text-accent-foreground transition-colors">DW</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-accent relative',
                  'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300',
                  'hover:after:w-full',
                  pathname === item.href
                    ? 'text-primary after:w-full after:bg-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-sm shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-b-2xl"
          >
            <nav className="py-4 space-y-2" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    'block px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg mx-2',
                    'hover:bg-muted/50 hover:text-accent shadow-[0_1px_0_rgba(7,178,196,0.25)]',
                    pathname === item.href
                      ? 'text-primary bg-primary/10 border-l-2 border-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 