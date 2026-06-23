import fs from 'fs'
import { NextResponse } from 'next/server'
import { getArticleImagePath } from '@/lib/articles/loader'

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

interface ArticleImageRouteProps {
  params: Promise<{ slug: string; path: string[] }>
}

export async function GET(_request: Request, { params }: ArticleImageRouteProps) {
  const { slug, path: pathSegments } = await params
  const relativePath = `images/${pathSegments.join('/')}`
  const absolutePath = getArticleImagePath(slug, relativePath)

  if (!absolutePath) {
    return new NextResponse('Not found', { status: 404 })
  }

  const extension = absolutePath.slice(absolutePath.lastIndexOf('.')).toLowerCase()
  const contentType = MIME_TYPES[extension] ?? 'application/octet-stream'
  const buffer = fs.readFileSync(absolutePath)

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
