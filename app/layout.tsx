import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const BASE_URL = 'https://lifeundercanvas.info'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Life Under CANVAS',
    template: '%s | Life Under CANVAS',
  },
  description: 'The latest research, clinical trials, and news on CANVAS syndrome (RFC1-related cerebellar ataxia, neuropathy and vestibular areflexia) — updated daily, in one place.',
  keywords: ['CANVAS syndrome', 'RFC1', 'cerebellar ataxia', 'vestibular areflexia', 'sensory neuropathy', 'RFC1 repeat expansion', 'rare neurological disease'],
  authors: [{ name: 'Life Under CANVAS' }],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: BASE_URL,
    siteName: 'Life Under CANVAS',
    title: 'Life Under CANVAS',
    description: 'The latest research, clinical trials, and news on CANVAS syndrome — updated daily, in one place.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Life Under CANVAS — CANVAS syndrome research hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Life Under CANVAS',
    description: 'The latest research, clinical trials, and news on CANVAS syndrome — updated daily.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
