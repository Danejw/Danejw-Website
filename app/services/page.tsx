import { type FC } from 'react'

const ServicesPage: FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-primary">Transform Your Business Documents Into an AI-Powered Knowledge Base</h1>
      <p className="text-muted-foreground text-center text-lg">
        Stop wasting time searching for information. I build custom AI agents that give your team instant access to your company&apos;s knowledge.
      </p>

      <h2 className="text-2xl font-semibold mt-8">The Challenge Your Business Faces</h2>
      <p>
        Your company has thousands of valuable documents scattered across Google Drive, SharePoint, and other platforms. Your employees spend hours every week searching for information that already exists, leading to decreased productivity and frustration.
      </p>

      <h2 className="text-2xl font-semibold mt-8">AI Knowledge Base Solution</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Automatically connects to your existing document storage systems</li>
        <li>Uses advanced AI to extract and understand content from PDFs, images, and documents</li>
        <li>Creates an intelligent, searchable knowledge base</li>
        <li>Provides a conversational AI assistant that answers questions instantly</li>
        <li>Updates automatically as you add new documents</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8">Proven Business Impact</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>15 hours saved per week</strong> on document searches across your team</li>
        <li><strong>Onboarding time reduced from 3 days to 30 minutes</strong> with instant access to procedures</li>
        <li><strong>$12,000 monthly savings</strong> in reduced consultant fees and improved efficiency</li>
        <li><strong>24/7 availability</strong> - your knowledge base never sleeps</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8">Investment & Value</h2>
      <div className="bg-muted p-6 rounded-lg">
        <p className="text-lg font-medium">One-time setup: $1,500</p>
        <p className="text-lg font-medium">Monthly maintenance: $1,000</p>
        <p className="text-sm text-muted-foreground mt-2">
          Most implementations are completed within 4 hours. Your system will be operational and saving time immediately.
        </p>
      </div>
      <p className="text-muted-foreground">
        With typical time savings, most businesses see ROI within the first month of implementation.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Ready to Transform Your Business?</h2>
      <p>
        Let&apos;s discuss how an AI knowledge base can streamline your operations and boost productivity. I&apos;ll analyze your current document workflow and show you exactly how much time and money you can save.
      </p>
    </div>
  )
}

export default ServicesPage
