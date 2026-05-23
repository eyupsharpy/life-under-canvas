import type { Article } from './types'

export async function fetchRedditPosts(maxResults = 8): Promise<Article[]> {
  const query = encodeURIComponent('CANVAS RFC1 cerebellar ataxia neuropathy vestibular')
  const res = await fetch(
    `https://www.reddit.com/search.json?q=${query}&sort=new&t=all&limit=${maxResults}&type=link`,
    {
      cache: 'no-store',
      headers: { 'User-Agent': 'web:life-under-canvas:1.0 (CANVAS syndrome information site)' },
    }
  )
  if (!res.ok) return []
  const data = await res.json()
  const children = data.data?.children ?? []

  return children
    .filter((c: { data: { title: string; url: string } }) => c.data?.title && c.data?.url)
    .map((c: {
      data: {
        id: string
        title: string
        author: string
        subreddit_name_prefixed: string
        created_utc: number
        url: string
        permalink: string
        selftext: string
        num_comments: number
      }
    }) => {
      const post = c.data
      const date = new Date(post.created_utc * 1000).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
      const summary = post.selftext
        ? post.selftext.slice(0, 200).replace(/\n/g, ' ')
        : undefined

      return {
        id: post.id,
        title: post.title,
        authors: `u/${post.author} · ${post.subreddit_name_prefixed}`,
        journal: `${post.num_comments} comment${post.num_comments !== 1 ? 's' : ''}`,
        pubDate: date,
        url: `https://www.reddit.com${post.permalink}`,
        source: 'News' as const,
        summary,
      }
    })
}
