import { Redis } from '@upstash/redis'
import { put } from '@vercel/blob'

const kv = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})
import { fetchLatestArticles } from '@/lib/pubmed'
import { fetchTrials } from '@/lib/clinicaltrials'
import { fetchIsrctnTrials } from '@/lib/isrctn'
import { fetchPreprints } from '@/lib/europepmc'
import { fetchNews } from '@/lib/news'
import { fetchAtaxiaUKNews } from '@/lib/ataxiauk'
import { fetchEuroAtaxiaNews } from '@/lib/euroataxia'
import { fetchYouTubeVideos } from '@/lib/youtube'
import { sendNewArticlesEmail } from '@/lib/email'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const seenIds: string[] = (await kv.get('seen_article_ids')) ?? []
  const seenSet = new Set(seenIds)

  const [research, preprints, trials, isrctn, news, ataxiauk, euroataxia, youtube] = await Promise.all([
    fetchLatestArticles(20),
    fetchPreprints(10),
    fetchTrials(10),
    fetchIsrctnTrials(10),
    fetchNews(10),
    fetchAtaxiaUKNews(10),
    fetchEuroAtaxiaNews(10),
    fetchYouTubeVideos(10),
  ])

  const allArticles = [...research, ...preprints, ...trials, ...isrctn, ...news, ...ataxiauk, ...euroataxia, ...youtube]
  const newArticles = allArticles.filter((a) => !seenSet.has(a.id))

  const isUnsubscribed = await kv.get('email_unsubscribed')

  if (newArticles.length > 0) {
    const date = new Date().toISOString().slice(0, 10)
    await Promise.all([
      isUnsubscribed ? Promise.resolve() : sendNewArticlesEmail(newArticles),
      put(`archive/${date}.json`, JSON.stringify(newArticles), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
      }),
    ])
    const updatedIds = [...new Set([...seenIds, ...allArticles.map((a) => a.id)])]
    await kv.set('seen_article_ids', updatedIds.slice(-500))
  }

  return Response.json({
    checked: true,
    newCount: newArticles.length,
    totalTracked: seenIds.length + newArticles.length,
  })
}
