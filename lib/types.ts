export interface Article {
  id: string
  title: string
  authors: string
  journal: string
  pubDate: string
  url: string
  source: 'PubMed' | 'Europe PMC' | 'ClinicalTrials.gov' | 'News'
  status?: string
  summary?: string
}
