import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Life Under CANVAS',
  description: 'Your personal guide to living with CANVAS syndrome — latest research and answers.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  )
}
