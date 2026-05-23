import { Resend } from 'resend'
import type { Article } from './types'

export async function sendNewArticlesEmail(articles: Article[]) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const articleList = articles
    .map(
      (a) =>
        `<li style="margin-bottom:24px;">
          <a href="${a.url}" style="font-size:17px;font-weight:600;color:#1d1d1f;text-decoration:none;">${a.title}</a>
          <p style="margin:4px 0 0;font-size:14px;color:#6e6e73;">${a.authors}${a.journal ? ` · ${a.journal}` : ''}${a.pubDate ? ` · ${a.pubDate}` : ''}</p>
          <a href="${a.url}" style="font-size:14px;color:#0071e3;text-decoration:none;">Read on PubMed →</a>
        </li>`
    )
    .join('')

  await resend.emails.send({
    from: 'Life Under CANVAS <updates@resend.dev>',
    to: 'sharp.darlene@googlemail.com',
    subject: `${articles.length} new CANVAS ${articles.length === 1 ? 'study' : 'studies'} found`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',system-ui,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;background:#ffffff;">
        <h1 style="font-size:28px;font-weight:700;color:#1d1d1f;letter-spacing:-0.02em;margin:0 0 8px;">New CANVAS research</h1>
        <p style="font-size:17px;color:#6e6e73;margin:0 0 32px;">We found ${articles.length} new ${articles.length === 1 ? 'study' : 'studies'} you haven't seen yet.</p>
        <ul style="list-style:none;padding:0;margin:0;">${articleList}</ul>
        <hr style="border:none;border-top:1px solid #d2d2d7;margin:32px 0;" />
        <p style="font-size:13px;color:#6e6e73;margin:0;">
          You're receiving this because you're signed up to Life Under CANVAS updates.<br/>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color:#0071e3;">Visit the site</a> to ask questions about the latest research.
        </p>
      </div>
    `,
  })
}
