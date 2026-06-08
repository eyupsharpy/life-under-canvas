import { list } from '@vercel/blob'
import Link from 'next/link'
import type { Article } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function getArchive(): Promise<{ date: string; articles: Article[] }[]> {
  const { blobs } = await list({ prefix: 'archive/' })

  const sorted = blobs
    .filter((b) => b.pathname.endsWith('.json'))
    .sort((a, b) => b.pathname.localeCompare(a.pathname))

  const results = await Promise.all(
    sorted.map(async (blob) => {
      const date = blob.pathname.replace('archive/', '').replace('.json', '')
      try {
        const res = await fetch(blob.url, { next: { revalidate: 86400 } })
        const articles: Article[] = await res.json()
        return { date, articles }
      } catch {
        return { date, articles: [] }
      }
    })
  )

  return results.filter((r) => r.articles.length > 0)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const SOURCE_LABEL: Record<string, string> = {
  PubMed: 'PubMed',
  'Europe PMC': 'Europe PMC',
  'ClinicalTrials.gov': 'Trial',
  ISRCTN: 'Trial',
  News: 'News',
  AtaxiaUK: 'Ataxia UK',
  EuroAtaxia: 'Euro Ataxia',
  YouTube: 'YouTube',
}

function ArticleRow({ article }: { article: Article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 py-4 border-b border-[#d2d2d7] last:border-0 hover:bg-[#f5f5f7] -mx-4 px-4 rounded-xl transition-colors"
    >
      <span className="shrink-0 mt-0.5 text-[11px] font-medium text-[#6e6e73] bg-[#f5f5f7] group-hover:bg-white px-2 py-0.5 rounded-full transition-colors w-20 text-center">
        {SOURCE_LABEL[article.source] ?? article.source}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-[#1d1d1f] leading-snug group-hover:text-[#0071e3] transition-colors">
          {article.title}
        </p>
        {(article.authors || article.journal) && (
          <p className="text-[13px] text-[#6e6e73] mt-0.5 truncate">
            {[article.authors, article.journal].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </a>
  )
}

export default async function ArchivePage() {
  const archive = await getArchive()

  return (
    <main className="min-h-screen">
      <nav className="sticky top-0 z-10 border-b border-[#d2d2d7] bg-white/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-[17px] font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors">
            Life under CANVAS
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/archive" className="text-[14px] text-[#0071e3] font-medium">
              Archive
            </Link>
            <Link href="/links" className="text-[14px] text-[#0071e3] font-medium hover:underline">
              Useful links
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-5xl md:text-7xl font-bold text-[#1d1d1f] mb-6 leading-tight">
          Archive.
        </h1>
        <p className="text-xl text-[#6e6e73] mb-16 max-w-2xl">
          Every update sent to Darlene, in one place.
        </p>

        {archive.length === 0 ? (
          <p className="text-[#6e6e73] text-lg">No archived updates yet — check back after the next daily digest.</p>
        ) : (
          <div className="space-y-16">
            {archive.map(({ date, articles }) => (
              <section key={date}>
                <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[#6e6e73] mb-6">
                  {formatDate(date)} · {articles.length} {articles.length === 1 ? 'update' : 'updates'}
                </h2>
                <div>
                  {articles.map((a) => (
                    <ArticleRow key={a.id} article={a} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-[#d2d2d7] mt-20">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-[13px] text-[#6e6e73]">
            Information on this site is for general awareness only and does not replace advice from your neurologist or specialist.
          </p>
        </div>
      </footer>
    </main>
  )
}
