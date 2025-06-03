import { type FC } from 'react'
import Link from 'next/link'
import Testimonials from '@/app/components/Testimonials'

const ServicesIndexPage: FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-primary">Services</h1>
      <div className="space-y-10">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">AI Knowledge Base</h2>
          <p className="text-muted-foreground">
            Transform scattered files into an intelligent, searchable resource for your team.
          </p>
          <Link href="/services/knowledge-base" className="text-primary underline hover:text-accent">
            Learn more
          </Link>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Web Application Development</h2>
          <p className="text-muted-foreground">
            Custom web-app creation with guided planning and pricing tiers for any size business.
          </p>
          <Link href="/services/web-app-development" className="text-primary underline hover:text-accent">
            Learn more
          </Link>
        </div>
      </div>
      <Testimonials />
    </div>
  )
}

export default ServicesIndexPage
