import type { Article } from './types'

export async function fetchYouTubeVideos(maxResults = 8): Promise<Article[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return []

  const query = encodeURIComponent('CANVAS syndrome RFC1 ataxia')
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&order=date&maxResults=${maxResults}&key=${apiKey}`,
    { cache: 'no-store' }
  )
  if (!res.ok) return []
  const data = await res.json()
  const items = data.items ?? []

  return items
    .filter((item: { id: { videoId?: string } }) => item.id?.videoId)
    .map((item: {
      id: { videoId: string }
      snippet: {
        title: string
        description: string
        channelTitle: string
        publishedAt: string
      }
    }) => {
      const { videoId } = item.id
      const { title, description, channelTitle, publishedAt } = item.snippet
      const date = new Date(publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      })

      return {
        id: videoId,
        title,
        authors: channelTitle,
        journal: '',
        pubDate: date,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        source: 'News' as const,
        summary: description?.slice(0, 200),
      }
    })
}
