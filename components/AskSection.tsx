'use client'

import { useState } from 'react'

export default function AskSection() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim()) return
    setLoading(true)
    setAnswer('')
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })
      const data = await res.json()
      setAnswer(data.answer ?? 'Something went wrong. Please try again.')
    } catch {
      setAnswer('Could not connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-[#f5f5f7] rounded-2xl p-8 md:p-12">
      <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-2">Ask a question</h2>
      <p className="text-[#6e6e73] text-lg mb-8">
        Ask anything about CANVAS syndrome — symptoms, research, daily life, or treatment.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What would you like to know about CANVAS?"
          rows={4}
          className="w-full rounded-xl border border-[#d2d2d7] bg-white px-4 py-3 text-[17px] text-[#1d1d1f] placeholder:text-[#6e6e73] focus:outline-none focus:ring-2 focus:ring-[#0071e3] resize-none"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="self-start rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Thinking…' : 'Ask'}
        </button>
      </form>

      {answer && (
        <div className="mt-8 border-t border-[#d2d2d7] pt-8">
          <p className="text-[15px] font-medium text-[#6e6e73] uppercase tracking-wide mb-3">Answer</p>
          <div className="text-[17px] text-[#1d1d1f] leading-relaxed whitespace-pre-wrap">{answer}</div>
        </div>
      )}
    </section>
  )
}
