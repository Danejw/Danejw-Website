import { type FC } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Web App Development - Dane Willacker',
  description: 'Professional web app development services with clear tiers and pricing.',
}

const WebAppDevelopmentPage: FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-primary">Custom Web Application Development</h1>
      <p className="text-muted-foreground text-center text-lg">
        We deliver high-quality, scalable web applications tailored to your specific needs. Whether
        you&apos;re launching a new product, streamlining internal workflows, or integrating
        cutting-edge technologies, our tiered service model provides a clear path from concept to
        completion.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Purpose</h2>
      <p>
        Our service is designed to help individuals, startups, and growing businesses build robust
        digital tools without navigating the technical complexity alone. We translate your goals into
        a reliable, user-focused application, using proven technologies and a structured development
        process.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Our Process</h2>
      <p>
        Every project begins with a focused consultation to understand your objectives, define the
        scope, and recommend the best technical approach. From there, we manage the entire
        development cycle and provide ongoing support as your needs evolve.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Service Tiers</h2>

      <h3 className="text-xl font-medium mt-4">Starter: Frontend-Only Applications</h3>
      <p>
        Ideal for landing pages, calculators, interactive demos, or user interfaces that do not
        require login or saved data.
      </p>
      <p className="font-medium">Includes</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Custom responsive interface</li>
        <li>Built using a modern frontend framework (such as React)</li>
        <li>Hosted and deployed for public access</li>
      </ul>
      <p className="font-medium mt-2">Pricing</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Initial Setup: $750 to $1,500</li>
        <li>Ongoing Maintenance: $50 to $150 per month</li>
        <li>Feature Additions: $150 to $300 per feature</li>
      </ul>

      <h3 className="text-xl font-medium mt-4">Growth: Full-Stack Web Applications</h3>
      <p>
        Ideal for platforms requiring user authentication, saved content, dashboards, or business
        logic.
      </p>
      <p className="font-medium">Includes</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>All features from the Starter tier</li>
        <li>Backend server with business logic and data processing</li>
        <li>Database integration for persistent storage (e.g., PostgreSQL, Supabase)</li>
        <li>User authentication and access control</li>
        <li>Admin panel or content management tools (optional)</li>
      </ul>
      <p className="font-medium mt-2">Pricing</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Initial Setup: $2,500 to $5,000</li>
        <li>Ongoing Maintenance: $200 to $500 per month</li>
        <li>Feature Additions: $300 to $600 per feature</li>
      </ul>

      <h3 className="text-xl font-medium mt-4">Scale: AI Integration and External Services</h3>
      <p>
        Ideal for intelligent applications requiring automation, third-party integrations, or
        advanced data capabilities.
      </p>
      <p className="font-medium">Includes</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>All features from the Growth tier</li>
        <li>Integration with third-party services (e.g., Stripe, Google APIs, Airtable)</li>
        <li>AI capabilities such as chat assistants, smart recommendations, or image recognition</li>
        <li>Background processing, notifications, and scheduled jobs</li>
      </ul>
      <p className="font-medium mt-2">Pricing</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Initial Setup: $5,000 to $10,000 and up, depending on complexity</li>
        <li>Ongoing Maintenance: $500 to $1,000 per month</li>
        <li>Feature Additions: $600 to $1,200 per feature</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8">Discovery Questions</h2>
      <p>To properly scope and design your application, we begin by answering the following:</p>
      <h3 className="text-xl font-medium mt-4">Business Objectives</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>What is the primary goal of this application?</li>
        <li>Who are the intended users, and what should they accomplish within the platform?</li>
        <li>What specific outcomes should the application enable or improve?</li>
      </ul>
      <h3 className="text-xl font-medium mt-4">Functional Requirements</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>Does the application need to store user information or preferences?</li>
        <li>Are there any required integrations with payment providers, APIs, or internal systems?</li>
        <li>Will the application require login, user roles, or admin access?</li>
        <li>Do you expect the app to scale to a high number of users?</li>
      </ul>
      <h3 className="text-xl font-medium mt-4">Data and Automation</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>Will the app send emails, notifications, or scheduled reminders?</li>
        <li>Do you require reports, dashboards, or analytics?</li>
        <li>Should the system perform AI-assisted functions, such as chat responses or content analysis?</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8">Summary</h2>
      <p>
        We specialize in building modern, reliable, and scalable web applications designed around
        your specific use case. With transparent pricing, defined tiers, and a professional
        development process, we help you move from idea to execution with clarity and confidence.
      </p>

      <p className="mt-8 text-center">
        If you&apos;re ready to start or need help identifying the right tier for your needs,{' '}
        <Link href="/contact" className="text-primary underline hover:text-accent">
          contact us
        </Link>{' '}
        to schedule your initial consultation.
      </p>
    </div>
  )
}

export default WebAppDevelopmentPage
