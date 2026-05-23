import type { Article } from './types'

const STATUS_LABELS: Record<string, string> = {
  RECRUITING: 'Recruiting',
  ACTIVE_NOT_RECRUITING: 'Active, not recruiting',
  NOT_YET_RECRUITING: 'Not yet recruiting',
  COMPLETED: 'Completed',
  TERMINATED: 'Terminated',
  WITHDRAWN: 'Withdrawn',
  ENROLLING_BY_INVITATION: 'Enrolling by invitation',
  SUSPENDED: 'Suspended',
  UNKNOWN: 'Unknown',
}

export async function fetchTrials(maxResults = 8): Promise<Article[]> {
  try {
  const query = encodeURIComponent(
    'CANVAS cerebellar ataxia neuropathy vestibular areflexia RFC1'
  )
  const res = await fetch(
    `https://clinicaltrials.gov/api/v2/studies?query.term=${query}&query.locn=United+Kingdom&pageSize=${maxResults}&sort=LastUpdatePostDate`,
    { cache: 'no-store' }
  )
  if (!res.ok) return []
  const data = await res.json()
  const studies = data.studies ?? []

  return studies.map((s: Record<string, unknown>) => {
    const protocol = s.protocolSection as Record<string, unknown>
    const id = protocol.identificationModule as Record<string, string>
    const status = protocol.statusModule as Record<string, unknown>
    const desc = protocol.descriptionModule as Record<string, string> | undefined
    const sponsor = protocol.sponsorCollaboratorsModule as Record<string, unknown> | undefined
    const nctId: string = id.nctId ?? ''
    const overallStatus: string = (status.overallStatus as string) ?? 'UNKNOWN'

    return {
      id: nctId,
      title: id.briefTitle ?? id.officialTitle ?? 'Untitled study',
      authors: (sponsor?.leadSponsor as Record<string, string>)?.name ?? '',
      journal: '',
      pubDate: (status.lastUpdatePostDateStruct as Record<string, string>)?.date ?? '',
      url: `https://clinicaltrials.gov/study/${nctId}`,
      source: 'ClinicalTrials.gov' as const,
      status: STATUS_LABELS[overallStatus] ?? overallStatus,
      summary: desc?.briefSummary?.slice(0, 200).replace(/\n/g, ' ') ?? '',
    }
  })
  } catch {
    return []
  }
}
