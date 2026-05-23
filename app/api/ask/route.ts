import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: Request) {
  const { messages } = await request.json()

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'Messages are required' }, { status: 400 })
  }

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: `You are a knowledgeable and compassionate assistant helping someone who lives with CANVAS syndrome (Cerebellar Ataxia with Neuropathy and Vestibular Areflexia Syndrome).

Answer questions clearly, accurately, and with empathy. Use plain language — avoid unnecessary jargon. When relevant, mention that they should consult their neurologist or specialist for personal medical decisions.

CANVAS syndrome is a rare recessive ataxia caused by biallelic RFC1 repeat expansions, characterised by cerebellar ataxia, sensory neuropathy, vestibular areflexia, and often a chronic cough.

Format your responses clearly: use short paragraphs. Do not use markdown headers or bullet points — write in flowing prose.`,
    messages,
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  return Response.json({ answer: text })
}
