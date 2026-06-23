import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { ArticleMeta } from '@/lib/articles/types'
import { stripArticlePreamble } from '@/lib/articles/parse-metadata'
import { formatDisplayDate } from '@/lib/articles/format-date'
import { ArticleMarkdown } from '@/app/components/ArticleMarkdown'

interface ArticleLayoutProps {
  article: ArticleMeta & { content: string }
}

export function ArticleLayout({ article }: ArticleLayoutProps) {
  return (
    <article className="max-w-4xl mx-auto px-6">
      <Link
        href="/articles"
        className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-slate-400 hover:text-cyan-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to articles
      </Link>

      <header className="mb-10 space-y-5">
        {(article.project || article.caseStudyType) && (
          <div className="flex flex-wrap gap-2">
            {article.project && (
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-200 text-[0.65rem] tracking-[0.2em] uppercase border border-cyan-500/40">
                {article.project}
              </span>
            )}
            {article.caseStudyType && (
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-slate-400 text-[0.65rem] tracking-[0.2em] uppercase">
                {article.caseStudyType}
              </span>
            )}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-400">Case study</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight tracking-tight">
            {article.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">
          <time dateTime={article.date}>{formatDisplayDate(article.date)}</time>
          {article.link && (
            <>
              <span aria-hidden="true">·</span>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 normal-case tracking-normal text-sm"
              >
                View project →
              </a>
            </>
          )}
        </div>

        {article.description && (
          <p className="text-base sm:text-lg text-slate-400 font-light leading-relaxed border-l-2 border-cyan-500 pl-6 bg-black/50 backdrop-blur-md p-4">
            {article.description}
          </p>
        )}
      </header>

      <div className="glass-panel rounded-2xl border border-white/10 bg-black/40 p-6 md:p-10 mb-4">
        <ArticleMarkdown content={stripArticlePreamble(article.content)} slug={article.slug} />
      </div>
    </article>
  )
}
