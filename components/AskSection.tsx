'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function renderInlineLinks(text: string) {
  const parts = text.split(/(\[[^\]]+\]\(https?:\/\/[^)]+\))/g)
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/)
    if (match) {
      return (
        <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer"
          className="text-[#0071e3] underline underline-offset-2 hover:text-[#0077ed]">
          {match[1]}
        </a>
      )
    }
    return part
  })
}

function AnswerText({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean)
  return (
    <div className="space-y-4">
      {paragraphs.map((para, i) => (
        <p key={i} className="text-[17px] text-[#1d1d1f] leading-relaxed">
          {renderInlineLinks(para.replace(/\n/g, ' '))}
        </p>
      ))}
    </div>
  )
}

export default function AskSection() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const question = input.trim()
    if (!question || loading) return

    const updated: Message[] = [...messages, { role: 'user', content: question }]
    setMessages(updated)
    setInput('')
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      })
      const data = await res.json()
      if (data.answer) {
        setMessages([...updated, { role: 'assistant', content: data.answer }])
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Could not connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const hasConversation = messages.length > 0

  return (
    <section className="bg-[#f5f5f7] rounded-2xl p-8 md:p-12">
      <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-2">Ask a question</h2>
      <p className="text-[#6e6e73] text-lg mb-8">
        Ask anything about CANVAS syndrome — symptoms, research, daily life, or treatment.
      </p>

      {hasConversation && (
        <div className="mb-8 space-y-6">
          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === 'user' ? (
                <div className="flex gap-3 items-start">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-[#0071e3] flex items-center justify-center">
                    <span className="text-white text-[13px] font-semibold">Q</span>
                  </div>
                  <p className="text-[17px] font-semibold text-[#1d1d1f] leading-snug pt-1">{msg.content}</p>
                </div>
              ) : (
                <div className="flex gap-3 items-start">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center">
                    <span className="text-white text-[13px] font-semibold">A</span>
                  </div>
                  <div className="pt-1 flex-1">
                    <AnswerText text={msg.content} />
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-start">
              <div className="shrink-0 w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center">
                <span className="text-white text-[13px] font-semibold">A</span>
              </div>
              <div className="pt-2 flex gap-1">
                <span className="w-2 h-2 bg-[#6e6e73] rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-[#6e6e73] rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-[#6e6e73] rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}

      {error && (
        <p className="text-[15px] text-red-600 mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          placeholder={hasConversation ? 'Ask a follow-up question…' : 'What would you like to know about CANVAS?'}
          rows={hasConversation ? 2 : 4}
          className="w-full rounded-xl border border-[#d2d2d7] bg-white px-4 py-3 text-[17px] text-[#1d1d1f] placeholder:text-[#6e6e73] focus:outline-none focus:ring-2 focus:ring-[#0071e3] resize-none"
        />
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Thinking…' : hasConversation ? 'Send' : 'Ask'}
          </button>
          {hasConversation && (
            <button
              type="button"
              onClick={() => { setMessages([]); setInput(''); setError('') }}
              className="text-[14px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
            >
              Start new conversation
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
