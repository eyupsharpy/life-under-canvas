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
  return text.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#8217;/g, "'").replace(/&#038;/g, '&').trim()
}

export async function fetchAtaxiaUKNews(maxResults = 8): Promise<Article[]> {
  try {
    const res = await fetch('https://www.ataxia.org.uk/feed/', { cache: 'no-store' })
    if (!res.ok) return []
    const xml = await res.text()

    const items: Article[] = []
    let cursor = 0

    while (items.length < maxResults) {
      const start = xml.indexOf('<item>', cursor)
      if (start === -1) break
      const end = xml.indexOf('</item>', start)
      if (end === -1) break
      const block = xml.slice(start + 6, end)
      cursor = end + 7

      const rawTitle = stripCdata(extractBetween(block, '<title>', '</title>'))
      const title = stripHtml(rawTitle)
      const link = stripCdata(extractBetween(block, '<link>', '</link>')).trim()
      const pubDate = extractBetween(block, '<pubDate>', '</pubDate>')

      // Skip if missing essentials
      if (!title || !link) continue

      // Only include research news and relevant content (skip pure support-page updates)
      const lowerTitle = title.toLowerCase()
      const lowerLink = link.toLowerCase()
      const isSupport = lowerLink.includes('/support-services/') && !lowerLink.includes('research')
      const isGeneric = lowerLink.includes('/newly-diagnosed/specialist') || lowerLink.includes('/volunteers-week')
      if (isSupport || isGeneric) continue

      const id = link.split('/').filter(Boolean).pop() ?? link
      const date = pubDate
        ? new Date(pubDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : ''

      // Extract summary from description
      const rawDesc = stripCdata(extractBetween(block, '<description>', '</description>'))
      const summary = stripHtml(rawDesc).slice(0, 200) || undefined

      items.push({
        id,
        title,
        authors: 'Ataxia UK',
        journal: '',
        pubDate: date,
        url: link,
        source: 'News',
        summary,
      })
    }

    return items
  } catch {
    return []
  }
}
