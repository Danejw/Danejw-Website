import { type FC } from 'react'
import Link from 'next/link'
import { ThemeAwareCircuitBackground } from '@/app/components/ThemeAwareCircuitBackground'

const NotFoundPage: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ThemeAwareCircuitBackground />
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-card-foreground">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off into the digital void.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors duration-200"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
