import { type FC } from 'react'
import Link from 'next/link'

const articles = [
  {
    title: 'Automating Repetitive Administrative Tasks and Communications',
    summary: 'Many jobs involve tedious, manual tasks that detract from more strategic work. AI can act as a super-assistant to tackle these chores.',
    slug: 'automating-repetitive-tasks-and-communications',
  },
  {
    title: 'Enhancing Customer Interaction and Support',
    summary: 'Delivering consistently efficient and helpful customer service can be challenging, especially with complex inquiries or the need for standardized communication.',
    slug: 'enhancing-customer-interaction-and-support',
  },
]

const ArticlesIndexPage: FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-primary">Articles</h1>
      <div className="space-y-10">
        {articles.map(article => (
          <div key={article.slug} className="space-y-2">
            <h2 className="text-2xl font-semibold">{article.title}</h2>
            <p className="text-muted-foreground">{article.summary}</p>
            <Link href={`/articles/${article.slug}`} className="text-primary underline hover:text-accent">
              Read more
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ArticlesIndexPage
