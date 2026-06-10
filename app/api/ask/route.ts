import Anthropic from '@anthropic-ai/sdk'
import { fetchLatestArticles } from '@/lib/pubmed'
import { fetchPreprints } from '@/lib/europepmc'

const client = new Anthropic()

const STATIC_REFERENCES = [
  {
    title: 'Cerebellar ataxia, neuropathy, vestibular areflexia syndrome (CANVAS) — Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Cerebellar_ataxia,_neuropathy,_vestibular_areflexia_syndrome',
  },
]

async function getRecentArticles() {
  const [pubmed, preprints] = await Promise.allSettled([
    fetchLatestArticles(15),
    fetchPreprints(8),
  ])
  return [
    ...STATIC_REFERENCES,
    ...(pubmed.status === 'fulfilled' ? pubmed.value : []),
    ...(preprints.status === 'fulfilled' ? preprints.value : []),
  ]
}

export async function POST(request: Request) {
  const { messages } = await request.json()

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'Messages are required' }, { status: 400 })
  }

  const articles = await getRecentArticles()

  const citationContext = articles.length > 0
    ? `\n\nYou have access to the following CANVAS reference sources. When your answer references findings that match one of these sources, cite it inline as [Title](URL). Only cite sources from this list — do not invent citations.\n\nSources:\n${articles.map((a) => `- ${a.title} | ${a.url}`).join('\n')}`
    : ''

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: `You are a knowledgeable and compassionate assistant helping someone who lives with CANVAS syndrome (Cerebellar Ataxia with Neuropathy and Vestibular Areflexia Syndrome).

Answer questions clearly, accurately, and with empathy. Use plain language — avoid unnecessary jargon. When relevant, mention that they should consult their neurologist or specialist for personal medical decisions.

CANVAS syndrome is a rare recessive ataxia caused by biallelic RFC1 repeat expansions, characterised by cerebellar ataxia, sensory neuropathy, vestibular areflexia, and often a chronic cough.

Format your responses clearly: use short paragraphs. Do not use markdown headers or bullet points — write in flowing prose.${citationContext}`,
    messages,
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  return Response.json({ answer: text })
}
