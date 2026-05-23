import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Life Under CANVAS'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: '#6e6e73',
            marginBottom: 24,
            letterSpacing: '-0.02em',
          }}
        >
          lifeundercanvas.info
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: '#1d1d1f',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: 32,
          }}
        >
          Life under{'\n'}CANVAS.
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#6e6e73',
            lineHeight: 1.4,
            maxWidth: 800,
          }}
        >
          The latest research on CANVAS syndrome, in one place — updated daily.
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 80,
            width: 16,
            height: 16,
            borderRadius: 8,
            background: '#0071e3',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
