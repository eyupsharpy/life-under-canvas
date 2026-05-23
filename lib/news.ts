import type { Article } from './types'

function extractBetween(text: string, open: string, close: string): string {
  const start = text.indexOf(open)
  if (start === -1) return ''
  const end = text.indexOf(close, start + open.length)
  if (end === -1) return ''
  return text.slice(start + open.length, end).trim()
}

function stripCdata(text: string): string {
  return text.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim()
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, '').trim()
}

function parseRssItems(xml: string): Article[] {
  const items: Article[] = []
  let rest = xml
  let cursor = 0

  while (true) {
    const start = rest.indexOf('<item>', cursor)
    if (start === -1) break
    const end = rest.indexOf('</item>', start)
    if (end === -1) break
    const block = rest.slice(start + 6, end)
    cursor = end + 7

    const rawTitle = stripCdata(extractBetween(block, '<title>', '</title>'))
    const title = stripHtml(rawTitle)
    const link = stripCdata(extractBetween(block, '<link>', '</link>'))
    const pubDate = extractBetween(block, '<pubDate>', '</pubDate>')
    const source = stripCdata(extractBetween(block, '<source', '</source>')).replace(/^[^>]*>/, '')

    if (!title || !link) continue

    const id = link.split('/').pop() ?? link
    const date = pubDate ? new Date(pubDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

    items.push({
      id,
      title,
      authors: source,
      journal: '',
      pubDate: date,
      url: link,
      source: 'News',
    })
  }

  return items
}

export async function fetchNews(maxResults = 8): Promise<Article[]> {
  try {
    const query = encodeURIComponent('CANVAS syndrome ataxia RFC1 UK')
    const res = await fetch(
      `https://news.google.com/rss/search?q=${query}&hl=en-GB&gl=GB&ceid=GB:en`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const xml = await res.text()
    return parseRssItems(xml).slice(0, maxResults)
  } catch {
    return []
  }
}
