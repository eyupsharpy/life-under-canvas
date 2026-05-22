import { Suspense } from 'react'
import { fetchLatestArticles } from '@/lib/pubmed'
import AskSection from '@/components/AskSection'

function ArticleSkeleton() {
  return (
    <div className="border border-[#d2d2d7] rounded-2xl p-6 animate-pulse">
      <div className="h-5 bg-[#f5f5f7] rounded w-3/4 mb-3" />
      <div className="h-4 bg-[#f5f5f7] rounded w-1/2 mb-2" />
      <div className="h-4 bg-[#f5f5f7] rounded w-1/3" />
    </div>
  )
}

async function ArticleList() {
  const articles = await fetchLatestArticles(12)

  if (articles.length === 0) {
    return (
      <p className="text-[#6e6e73] text-lg">
        No articles found right now. Check back soon.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {articles.map((article) => (
        <a
          key={article.id}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group border border-[#d2d2d7] rounded-2xl p-6 hover:border-[#0071e3] transition-colors"
        >
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] leading-snug mb-2 group-hover:text-[#0071e3] transition-colors">
            {article.title}
          </h3>
          {article.authors && (
            <p className="text-[14px] text-[#6e6e73] mb-1">{article.authors}</p>
          )}
          <p className="text-[14px] text-[#6e6e73]">
            {[article.journal, article.pubDate].filter(Boolean).join(' · ')}
          </p>
          <span className="mt-3 inline-block text-[14px] text-[#0071e3]">
            Read on PubMed →
          </span>
        </a>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-10 border-b border-[#d2d2d7] bg-white/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
          <span className="text-[17px] font-semibold text-[#1d1d1f]">Life Under CANVAS</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-20">
        {/* Hero */}
        <section>
          <h1 className="text-5xl md:text-7xl font-bold text-[#1d1d1f] mb-6 leading-tight">
            Life Under<br />CANVAS.
          </h1>
          <p className="text-xl md:text-2xl text-[#6e6e73] max-w-2xl leading-relaxed">
            The latest research on CANVAS syndrome, in one place — updated automatically, and always here when you need answers.
          </p>
        </section>

        {/* Research */}
        <section>
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-3xl font-semibold text-[#1d1d1f]">Latest research</h2>
            <span className="text-[14px] text-[#6e6e73]">From PubMed</span>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ArticleSkeleton key={i} />
                ))}
              </div>
            }
          >
            <ArticleList />
          </Suspense>
        </section>

        {/* Ask */}
        <AskSection />
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
