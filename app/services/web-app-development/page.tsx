import { type FC } from 'react'
import Link from 'next/link'

const WebAppDevelopmentPage: FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-primary">Custom Web Application Development</h1>
      <p className="text-muted-foreground text-center text-lg">
        I build tailored web apps that streamline your business processes and delight your users.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Consultation & Planning</h2>
      <p>
        Every project begins with a deep-dive consultation to understand your goals. We schedule calls to map features, choose technologies, and set milestones so you know exactly what to expect.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Pricing Options</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Starter</strong> – affordable basics for launching your idea</li>
        <li><strong>Growth</strong> – expanded features and ongoing support</li>
        <li><strong>Enterprise</strong> – robust integrations and scale-ready architecture</li>
      </ul>

      <p className="mt-8 text-center">
        Ready to build your app?{' '}
        <Link href="/contact" className="text-primary underline hover:text-accent">
          Get in touch
        </Link>
        .
      </p>
    </div>
  )
}

export default WebAppDevelopmentPage
