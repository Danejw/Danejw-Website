import Image from 'next/image'
import Link from 'next/link'
import { Children, isValidElement } from 'react'
import type { ReactElement, ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MermaidDiagram } from '@/app/components/MermaidDiagram'

interface ArticleMarkdownProps {
  content: string
  slug: string
}

function resolveImageSrc(src: string | undefined, slug: string): string | undefined {
  if (!src) return undefined
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
    return src
  }
  if (src.startsWith('images/')) {
    return `/articles/${slug}/${src}`
  }
  return `/articles/${slug}/images/${src}`
}

export function ArticleMarkdown({ content, slug }: ArticleMarkdownProps) {
  return (
    <div className="article-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1>{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          h3: ({ children }) => <h3>{children}</h3>,
          h4: ({ children }) => <h4>{children}</h4>,
          p: ({ children }) => <p>{children}</p>,
          a: ({ href, children }) => {
            const url = href ?? '#'
            if (url.startsWith('http')) {
              return (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              )
            }
            return <Link href={url}>{children}</Link>
          },
          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          blockquote: ({ children }) => <blockquote>{children}</blockquote>,
          hr: () => <hr />,
          table: ({ children }) => (
            <div className="table-wrapper">
              <table>{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead>{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => <th>{children}</th>,
          td: ({ children }) => <td>{children}</td>,
          img: ({ src, alt }) => {
            const resolvedSrc = resolveImageSrc(typeof src === 'string' ? src : undefined, slug)
            if (!resolvedSrc) return null

            if (resolvedSrc.startsWith('http')) {
              return (
                <Image
                  src={resolvedSrc}
                  alt={alt ?? ''}
                  width={1200}
                  height={675}
                  className="article-image"
                  unoptimized
                />
              )
            }

            return (
              <Image
                src={resolvedSrc}
                alt={alt ?? ''}
                width={1200}
                height={675}
                className="article-image"
                unoptimized
              />
            )
          },
          pre: ({ children }) => {
            const child = Children.only(children)
            if (!isValidElement(child)) {
              return <pre>{children}</pre>
            }

            const codeChild = child as ReactElement<{ className?: string; children?: ReactNode }>
            const className = codeChild.props.className ?? ''
            const codeText = String(codeChild.props.children ?? '').replace(/\n$/, '')

            if (className.includes('language-mermaid')) {
              return <MermaidDiagram chart={codeText} />
            }

            return (
              <pre>
                <code className={className}>{codeText}</code>
              </pre>
            )
          },
          code: ({ className, children }) => {
            if (className?.includes('language-')) {
              return <code className={className}>{children}</code>
            }
            return <code>{children}</code>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
