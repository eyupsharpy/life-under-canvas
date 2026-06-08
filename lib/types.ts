export interface Article {
  id: string
  title: string
  authors: string
  journal: string
  pubDate: string
  url: string
  source: 'PubMed' | 'Europe PMC' | 'ClinicalTrials.gov' | 'ISRCTN' | 'News' | 'AtaxiaUK' | 'EuroAtaxia' | 'YouTube'
  status?: string
  summary?: string
}
