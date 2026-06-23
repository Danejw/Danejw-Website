import { SiteShell } from '@/app/components/SiteShell'

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SiteShell>{children}</SiteShell>
}
