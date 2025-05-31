import { type FC } from 'react'

const ServicesPage: FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-primary">Instant Access to Your Company&#39;s Knowledge</h1>
      <p className="text-muted-foreground text-center">
        I build AI agents that turn your business documents into an always-on knowledge base.
      </p>

      <h2 className="text-2xl font-semibold mt-8">The Problem</h2>
      <p>
        Most companies store thousands of files in Google Drive. Employees waste hours searching for information that already exists.
      </p>

      <h2 className="text-2xl font-semibold mt-8">My Solution</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Automatically fetches new documents from Google Drive</li>
        <li>Extracts key data from PDFs, images and more using AI</li>
        <li>Creates a searchable knowledge base with vector embeddings</li>
        <li>Deploys a chat agent that answers questions instantly</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8">Real Results</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>15 hours saved each week on document searches</li>
        <li>Onboarding reduced from three days to thirty minutes</li>
        <li>$12k per month in consultant fees eliminated</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8">Pricing</h2>
      <p>Setup is $1,500 with a $1,000 monthly maintenance fee. Most builds take about four hours.</p>

      <h2 className="text-2xl font-semibold mt-8">Tech Stack</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>n8n for automation (free tier)</li>
        <li>OpenAI API for processing (around $30 per month)</li>
        <li>Supabase for vector storage (free)</li>
        <li>Google Drive integration</li>
      </ul>
      <p className="text-muted-foreground">Total operating cost is under $50 per month.</p>

      <h2 className="text-2xl font-semibold mt-8">How to Get Started</h2>
      <p>
        Identify businesses drowning in documents, build a quick proof of concept with sample files, and demonstrate the time savings. Most clients close at $2k or more, and agencies routinely scale this service to significant recurring revenue.
      </p>
    </div>
  )
}

export default ServicesPage
