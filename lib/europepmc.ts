import type { Article } from './types'

export async function fetchPreprints(maxResults = 8): Promise<Article[]> {
  const query = encodeURIComponent(
    '(CANVAS OR "cerebellar ataxia neuropathy vestibular") AND SRC:PPR'
  )
  const res = await fetch(
    `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${query}&format=json&resultType=core&pageSize=${maxResults}&sort=date+desc`,
    { cache: 'no-store' }
  )
  const data = await res.json()
  const results = data.resultList?.result ?? []

  return results.map(
    (r: {
      id: string
      title: string
      authorString?: string
      journalTitle?: string
      source?: string
      firstPublicationDate?: string
      doi?: string
    }) => {
      const authors = r.authorString ?? ''
      const authorStr =
        authors.split(', ').length > 3
          ? authors.split(', ').slice(0, 3).join(', ') + ' et al.'
          : authors

      return {
        id: r.id,
        title: r.title?.replace(/\.$/, '') ?? 'Untitled',
        authors: authorStr,
        journal: r.journalTitle ?? r.source ?? 'Preprint',
        pubDate: r.firstPublicationDate ?? '',
        url: r.doi
          ? `https://doi.org/${r.doi}`
          : `https://europepmc.org/article/${r.source}/${r.id}`,
        source: 'Europe PMC' as const,
      }
    }
  )
}
