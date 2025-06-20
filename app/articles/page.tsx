import Link from 'next/link'

const articles = [
  {
    title: 'Automating Repetitive Administrative Tasks and Communications',
    slug: 'automating-repetitive-administrative-tasks',
    description:
      'Use AI as a super-assistant to summarize meetings, draft emails and update trackers.',
    date: '2025-06-03'
  },
  {
    title: 'Enhancing Customer Interaction and Support',
    slug: 'enhancing-customer-interaction-and-support',
    description:
      'Design AI agents to draft empathetic responses and standardize communication.',
    date: '2025-06-03'
  },
  {
    title: 'Improving Bid Accuracy and Turnaround',
    slug: 'improving-bid-accuracy-and-turnaround',
    description:
      'Analyze historical bids and materials pricing with AI to produce fast, accurate estimates.',
    date: '2025-06-03'
  },
  {
    title: 'AI Customer Support for Supabase Integration',
    slug: 'ai-customer-support-for-supabase-integration',
    description:
      'Automated email replies and feature logging for the Supabase Integration Unity asset.',
    date: '2025-06-05'
  },
  {
    title: 'Automating AI Music Video Publishing to Save Time and Effort',
    slug: 'automating-ai-music-video-publishing',
    description:
      'Automate the entire pipeline from audio and cover art to scheduled YouTube videos.',
    date: '2025-06-08'
  }
]

export default function ArticlesIndexPage() {
  const sorted = [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-primary">Articles</h1>
      <ul className="space-y-6">
        {sorted.map(article => (
          <li key={article.slug} className="border-b border-border pb-6">
            <h2 className="text-2xl font-semibold">
              <Link href={`/articles/${article.slug}`} className="hover:text-accent underline">
                {article.title}
              </Link>
            </h2>
            <p className="text-muted-foreground mt-2">{article.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
