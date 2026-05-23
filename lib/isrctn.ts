import type { Article } from './types'

export async function fetchIsrctnTrials(maxResults = 6): Promise<Article[]> {
  try {
    const query = encodeURIComponent('CANVAS ataxia RFC1 cerebellar neuropathy vestibular')
    const res = await fetch(
      `https://www.isrctn.com/api/query?q=${query}&filters=&page=1&pageSize=${maxResults}&format=json`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    const items = data.content ?? []

    return items.map((t: {
      isrctn: string
      title?: string
      trialDescription?: string
      overallStatus?: string
      recruitmentStart?: string
      leadSponsor?: string
      url?: string
    }) => ({
      id: t.isrctn,
      title: t.title ?? 'Untitled study',
      authors: t.leadSponsor ?? '',
      journal: '',
      pubDate: t.recruitmentStart ?? '',
      url: t.url ?? `https://www.isrctn.com/${t.isrctn}`,
      source: 'ClinicalTrials.gov' as const,
      status: t.overallStatus ?? '',
      summary: t.trialDescription?.slice(0, 200).replace(/\n/g, ' '),
    }))
  } catch {
    return []
  }
}
