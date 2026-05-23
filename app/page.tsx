import { Suspense } from 'react'
import { fetchLatestArticles } from '@/lib/pubmed'
import { fetchTrials } from '@/lib/clinicaltrials'
import { fetchIsrctnTrials } from '@/lib/isrctn'
import { fetchPreprints } from '@/lib/europepmc'
import { fetchNews } from '@/lib/news'
import { fetchRedditPosts } from '@/lib/reddit'
import { fetchYouTubeVideos } from '@/lib/youtube'
import type { Article } from '@/lib/types'
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

function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => <ArticleSkeleton key={i} />)}
    </div>
  )
}

function ResearchCard({ article }: { article: Article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group border border-[#d2d2d7] rounded-2xl p-6 hover:border-[#0071e3] transition-colors flex flex-col"
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
      <span className="mt-auto pt-3 inline-block text-[14px] text-[#0071e3]">
        Read more →
      </span>
    </a>
  )
}

function TrialCard({ article }: { article: Article }) {
  const statusColour =
    article.status === 'Recruiting' || article.status === 'Not yet recruiting'
      ? 'bg-green-100 text-green-800'
      : 'bg-[#f5f5f7] text-[#6e6e73]'

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group border border-[#d2d2d7] rounded-2xl p-6 hover:border-[#0071e3] transition-colors flex flex-col"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-[17px] font-semibold text-[#1d1d1f] leading-snug group-hover:text-[#0071e3] transition-colors">
          {article.title}
        </h3>
        {article.status && (
          <span className={`shrink-0 text-[12px] font-medium px-2 py-0.5 rounded-full ${statusColour}`}>
            {article.status}
          </span>
        )}
      </div>
      {article.authors && (
        <p className="text-[14px] text-[#6e6e73] mb-2">{article.authors}</p>
      )}
      {article.summary && (
        <p className="text-[14px] text-[#6e6e73] leading-relaxed line-clamp-3">{article.summary}…</p>
      )}
      <span className="mt-auto pt-3 inline-block text-[14px] text-[#0071e3]">
        View trial →
      </span>
    </a>
  )
}

function SectionHeader({ title, source }: { title: string; source: string }) {
  return (
    <div className="flex items-baseline justify-between mb-8">
      <h2 className="text-3xl font-semibold text-[#1d1d1f]">{title}</h2>
      <span className="text-[14px] text-[#6e6e73]">{source}</span>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return <p className="text-[#6e6e73] text-lg">{message}</p>
}

async function ResearchSection() {
  const articles = await fetchLatestArticles(12)
  return (
    <>
      <SectionHeader title="Latest research" source="PubMed" />
      {articles.length === 0
        ? <EmptyState message="No articles found right now. Check back soon." />
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((a) => <ResearchCard key={a.id} article={a} />)}
          </div>
        )}
    </>
  )
}

async function PreprintsSection() {
  const articles = await fetchPreprints(8)
  if (articles.length === 0) return null
  return (
    <>
      <SectionHeader title="Preprints & early research" source="Europe PMC" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((a) => <ResearchCard key={a.id} article={a} />)}
      </div>
    </>
  )
}

async function TrialsSection() {
  const [ctGov, isrctn] = await Promise.all([fetchTrials(8), fetchIsrctnTrials(6)])
  const trials = [...ctGov, ...isrctn]
  if (trials.length === 0) return null
  return (
    <>
      <SectionHeader title="Clinical trials" source="ClinicalTrials.gov · ISRCTN" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trials.map((a) => <TrialCard key={a.id} article={a} />)}
      </div>
    </>
  )
}

async function NewsSection() {
  const articles = await fetchNews(8)
  if (articles.length === 0) return null
  return (
    <>
      <SectionHeader title="In the news" source="Google News" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((a) => <ResearchCard key={a.id} article={a} />)}
      </div>
    </>
  )
}

async function RedditSection() {
  const posts = await fetchRedditPosts(8)
  if (posts.length === 0) return null
  return (
    <>
      <SectionHeader title="Community discussion" source="Reddit" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((a) => <ResearchCard key={a.id} article={a} />)}
      </div>
    </>
  )
}

async function YouTubeSection() {
  const videos = await fetchYouTubeVideos(8)
  if (videos.length === 0) return null
  return (
    <>
      <SectionHeader title="Videos" source="YouTube" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((a) => <ResearchCard key={a.id} article={a} />)}
      </div>
    </>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="sticky top-0 z-10 border-b border-[#d2d2d7] bg-white/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
          <span className="text-[17px] font-semibold text-[#1d1d1f]">Life under CANVAS</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-20">
        <section>
          <h1 className="text-5xl md:text-7xl font-bold text-[#1d1d1f] mb-6 leading-tight">
            Life under<br />CANVAS.
          </h1>
          <p className="text-xl md:text-2xl text-[#6e6e73] max-w-2xl leading-relaxed">
            The latest research on CANVAS syndrome, in one place — updated automatically, and always here when you need answers.
          </p>
        </section>

        <section>
          <Suspense fallback={<><SectionHeader title="Latest research" source="PubMed" /><SkeletonGrid count={6} /></>}>
            <ResearchSection />
          </Suspense>
        </section>

        <section>
          <Suspense fallback={<SkeletonGrid count={4} />}>
            <PreprintsSection />
          </Suspense>
        </section>

        <section>
          <Suspense fallback={<SkeletonGrid count={4} />}>
            <TrialsSection />
          </Suspense>
        </section>

        <section>
          <Suspense fallback={<SkeletonGrid count={4} />}>
            <NewsSection />
          </Suspense>
        </section>

        <section>
          <Suspense fallback={<SkeletonGrid count={4} />}>
            <RedditSection />
          </Suspense>
        </section>

        <section>
          <Suspense fallback={<SkeletonGrid count={4} />}>
            <YouTubeSection />
          </Suspense>
        </section>

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
