import fs from 'fs'
import path from 'path'
import { ARTICLE_FILENAME, CONTENT_DIR } from '@/lib/articles/constants'
import { parseArticleMetadata } from '@/lib/articles/parse-metadata'
import type { Article, ArticleMeta } from '@/lib/articles/types'

function getArticleSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => fs.existsSync(path.join(CONTENT_DIR, slug, ARTICLE_FILENAME)))
}

function readArticleFile(slug: string): string {
  const filePath = path.join(CONTENT_DIR, slug, ARTICLE_FILENAME)
  return fs.readFileSync(filePath, 'utf8')
}

export function getAllArticles(): ArticleMeta[] {
  return getArticleSlugs()
    .map((slug) => {
      const content = readArticleFile(slug)
      return parseArticleMetadata(slug, content)
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(CONTENT_DIR, slug, ARTICLE_FILENAME)
  if (!fs.existsSync(filePath)) return null

  const content = readArticleFile(slug)
  const meta = parseArticleMetadata(slug, content)

  return { ...meta, content }
}

export function getArticleImagePath(slug: string, imagePath: string): string | null {
  const normalized = imagePath.replace(/^\/+/, '')
  const absolutePath = path.join(CONTENT_DIR, slug, normalized)

  if (!absolutePath.startsWith(path.join(CONTENT_DIR, slug))) return null
  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) return null

  return absolutePath
}

export function getAllArticleSlugs(): string[] {
  return getArticleSlugs()
}
