import type { ArticleMeta } from '@/lib/articles/types'

function extractBoldField(content: string, field: string): string | undefined {
  const normalized = content.replace(/\r\n/g, '\n')
  const pattern = new RegExp(`\\*\\*${field}:\\*\\*\\s*(.+?)(?:\\n|$)`, 'i')
  const match = normalized.match(pattern)
  return match?.[1]?.trim()
}

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m)
  return match?.[1]?.trim() ?? 'Untitled Article'
}

function parseDate(raw: string | undefined): string {
  if (!raw) return '1970-01-01'

  const isoMatch = raw.match(/(\d{4}-\d{2}-\d{2})/)
  if (isoMatch) return isoMatch[1]

  const monthDayYearMatch = raw.match(/([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/i)
  if (monthDayYearMatch) {
    const parsed = new Date(
      Number(monthDayYearMatch[3]),
      new Date(`${monthDayYearMatch[1]} 1, 2000`).getMonth(),
      Number(monthDayYearMatch[2]),
    )
    if (!Number.isNaN(parsed.getTime())) {
      const y = parsed.getFullYear()
      const m = String(parsed.getMonth() + 1).padStart(2, '0')
      const d = String(parsed.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    }
  }

  const monthYearMatch = raw.match(/([A-Za-z]+)\s+(\d{4})/)
  if (monthYearMatch) {
    const parsed = new Date(
      Number(monthYearMatch[2]),
      new Date(`${monthYearMatch[1]} 1, 2000`).getMonth(),
      1,
    )
    if (!Number.isNaN(parsed.getTime())) {
      const y = parsed.getFullYear()
      const m = String(parsed.getMonth() + 1).padStart(2, '0')
      return `${y}-${m}-01`
    }
  }

  const yearMatch = raw.match(/\b(\d{4})\b/)
  if (yearMatch) return `${yearMatch[1]}-01-01`

  return '1970-01-01'
}

function extractLink(content: string): string | undefined {
  const linkLine = extractBoldField(content, 'Link')
  if (!linkLine) return undefined

  const markdownLink = linkLine.match(/\[([^\]]*)\]\(([^)]+)\)/)
  if (markdownLink) return markdownLink[2]

  const urlMatch = linkLine.match(/https?:\/\/\S+/)
  return urlMatch?.[0]
}

export function parseArticleMetadata(slug: string, content: string): ArticleMeta {
  const title = extractTitle(content)
  const description =
    extractBoldField(content, 'What we learned') ??
    extractBoldField(content, 'The task') ??
    extractFirstParagraph(content) ??
    title

  const date = parseDate(extractBoldField(content, 'Last updated'))

  return {
    slug,
    title,
    description,
    date,
    project: extractBoldField(content, 'Project'),
    caseStudyType: extractBoldField(content, 'Case study type'),
    link: extractLink(content),
  }
}

export function stripArticlePreamble(content: string): string {
  const lines = content.split('\n')
  let index = 0

  if (lines[index]?.startsWith('# ')) {
    index += 1
  }

  while (index < lines.length && lines[index]?.trim() === '') {
    index += 1
  }

  while (index < lines.length && /^\*\*[^*]+:\*\*/.test(lines[index] ?? '')) {
    index += 1
    while (index < lines.length && lines[index]?.trim() === '') {
      index += 1
    }
  }

  return lines.slice(index).join('\n').trim()
}

function extractFirstParagraph(content: string): string | undefined {
  const withoutTitle = content.replace(/^#\s+.+\n+/, '')
  const blocks = withoutTitle.split(/\n{2,}/)

  for (const block of blocks) {
    const trimmed = block.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('**')) continue
    if (trimmed.startsWith('|')) continue
    if (trimmed.startsWith('![')) continue
    if (trimmed.startsWith('#')) continue
    if (trimmed.startsWith('```')) continue
    if (trimmed.startsWith('---')) continue

    return trimmed.replace(/\n/g, ' ')
  }

  return undefined
}
