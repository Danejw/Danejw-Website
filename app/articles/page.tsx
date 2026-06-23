import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getAllArticles } from '@/lib/articles/loader'
import { formatDisplayDate } from '@/lib/articles/format-date'

export default function ArticlesIndexPage() {
  const articles = getAllArticles()

  return (
    <div className="max-w-4xl mx-auto px-6 space-y-12">
      <header className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-400">Writing</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">
          Case Studies &amp; <span className="bg-cyan-500 text-black px-2 inline-block">Articles</span>
        </h1>
        <p className="text-lg text-slate-400 font-light leading-relaxed max-w-2xl mx-auto border-l-2 border-cyan-500 pl-6 bg-black/50 backdrop-blur-md p-4 text-left md:text-center md:border-l-0 md:pl-0 md:bg-transparent md:backdrop-blur-none md:p-0">
          Build stories, product lessons, and technical write-ups from real projects.
        </p>
      </header>

      <ul className="space-y-5">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/articles/${article.slug}`}
              className="group block glass-panel rounded-2xl border border-white/10 bg-black/60 p-6 md:p-8 shadow-[0_0_30px_rgba(6,182,212,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {article.project && (
                  <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-200 text-[0.65rem] tracking-[0.2em] uppercase border border-cyan-500/40">
                    {article.project}
                  </span>
                )}
                {article.caseStudyType && (
                  <span className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">
                    {article.caseStudyType}
                  </span>
                )}
                <time className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-500 ml-auto" dateTime={article.date}>
                  {formatDisplayDate(article.date)}
                </time>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-semibold text-white group-hover:text-cyan-300 transition-colors leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-slate-400 font-light leading-relaxed">{article.description}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
