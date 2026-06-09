import { Redis } from '@upstash/redis'
import { NextRequest } from 'next/server'

const kv = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token || token !== process.env.UNSUBSCRIBE_SECRET) {
    return new Response('Invalid unsubscribe link.', { status: 400 })
  }

  await kv.set('email_unsubscribed', '1')

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Unsubscribed</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',system-ui,sans-serif;max-width:600px;margin:80px auto;padding:0 24px;background:#ffffff;text-align:center;">
  <h1 style="font-size:26px;font-weight:700;color:#1d1d1f;letter-spacing:-0.02em;margin:0 0 16px;">You've been unsubscribed</h1>
  <p style="font-size:16px;color:#6e6e73;margin:0 0 24px;">You won't receive any more CANVAS updates by email.</p>
  <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="font-size:15px;color:#0071e3;text-decoration:none;">Visit Life Under CANVAS →</a>
</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
