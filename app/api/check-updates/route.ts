import { kv } from '@vercel/kv'
import { fetchNewArticleIds } from '@/lib/pubmed'
import { sendNewArticlesEmail } from '@/lib/email'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const seenIds: string[] = (await kv.get('seen_pubmed_ids')) ?? []
  const newArticles = await fetchNewArticleIds(seenIds)

  if (newArticles.length > 0) {
    await sendNewArticlesEmail(newArticles)
    const updatedIds = [...new Set([...seenIds, ...newArticles.map((a) => a.id)])]
    await kv.set('seen_pubmed_ids', updatedIds)
  }

  return Response.json({
    checked: true,
    newCount: newArticles.length,
    totalTracked: seenIds.length + newArticles.length,
  })
}
