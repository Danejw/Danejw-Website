export interface ArticleMeta {
  slug: string
  title: string
  description: string
  date: string
  project?: string
  caseStudyType?: string
  link?: string
}

export interface Article extends ArticleMeta {
  content: string
}
