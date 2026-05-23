import type { Article } from './types'

const QUERY = encodeURIComponent(
  '"CANVAS syndrome" OR "cerebellar ataxia neuropathy vestibular areflexia"'
)
const BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'

export async function fetchLatestArticles(maxResults = 12): Promise<Article[]> {
  try {
    const searchRes = await fetch(
      `${BASE}/esearch.fcgi?db=pubmed&term=${QUERY}&sort=pub+date&retmax=${maxResults}&retmode=json`,
      { cache: 'no-store' }
    )
    if (!searchRes.ok) return []
    const searchData = await searchRes.json()
    const ids: string[] = searchData.esearchresult?.idlist ?? []
    if (ids.length === 0) return []

    const summaryRes = await fetch(
      `${BASE}/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`,
      { cache: 'no-store' }
    )
    if (!summaryRes.ok) return []
    const summaryData = await summaryRes.json()

    return ids
      .filter((id) => summaryData.result[id])
      .map((id) => {
        const a = summaryData.result[id]
        const authors = (a.authors ?? []).map((x: { name: string }) => x.name)
        const authorStr =
          authors.length > 3
            ? `${authors.slice(0, 3).join(', ')} et al.`
            : authors.join(', ')
        return {
          id,
          title: a.title?.replace(/\.$/, '') ?? 'Untitled',
          authors: authorStr,
          journal: a.source ?? '',
          pubDate: a.pubdate ?? '',
          url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
          source: 'PubMed' as const,
        }
      })
  } catch {
    return []
  }
}

export async function fetchNewArticleIds(knownIds: string[]): Promise<Article[]> {
  const all = await fetchLatestArticles(20)
  const knownSet = new Set(knownIds)
  return all.filter((a) => !knownSet.has(a.id))
}
