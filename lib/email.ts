import { google } from 'googleapis'
import type { Article } from './types'

function getGmailClient() {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  )
  oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN })
  return google.gmail({ version: 'v1', auth: oAuth2Client })
}

function articleRow(a: Article) {
  return `<li style="margin-bottom:24px;">
    <a href="${a.url}" style="font-size:16px;font-weight:600;color:#1d1d1f;text-decoration:none;">${a.title}</a>
    <p style="margin:4px 0 0;font-size:13px;color:#6e6e73;">${[a.authors, a.journal, a.pubDate].filter(Boolean).join(' · ')}</p>
    <a href="${a.url}" style="font-size:13px;color:#0071e3;text-decoration:none;">Read more →</a>
  </li>`
}

function section(title: string, articles: Article[]) {
  if (articles.length === 0) return ''
  return `
    <h2 style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#6e6e73;margin:32px 0 16px;">${title}</h2>
    <ul style="list-style:none;padding:0;margin:0;">${articles.map(articleRow).join('')}</ul>`
}

export async function sendNewArticlesEmail(articles: Article[]) {
  const gmail = getGmailClient()
  const to = 'sharp.darlene@googlemail.com'
  const subject = `${articles.length} new CANVAS ${articles.length === 1 ? 'update' : 'updates'} found`

  const research = articles.filter(a => a.source === 'PubMed' || a.source === 'Europe PMC')
  const trials = articles.filter(a => a.source === 'ClinicalTrials.gov')
  const news = articles.filter(a => a.source === 'News')

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',system-ui,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;background:#ffffff;">
  <h1 style="font-size:26px;font-weight:700;color:#1d1d1f;letter-spacing:-0.02em;margin:0 0 8px;">New CANVAS updates</h1>
  <p style="font-size:16px;color:#6e6e73;margin:0 0 8px;">
    ${articles.length} new ${articles.length === 1 ? 'item' : 'items'} since your last briefing.
  </p>
  ${section('Research', research)}
  ${section('Clinical Trials', trials)}
  ${section('News & Updates', news)}
  <hr style="border:none;border-top:1px solid #d2d2d7;margin:32px 0;" />
  <p style="font-size:12px;color:#6e6e73;margin:0;">
    You're receiving this because you're signed up to Life Under CANVAS updates.<br/>
    <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color:#0071e3;">Visit the site</a> to ask questions about the latest research.<br/>
    To stop receiving these updates, reply to this email.
  </p>
</body>
</html>`

  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    html,
  ].join('\n')

  const encoded = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  await gmail.users.messages.send({ userId: 'me', requestBody: { raw: encoded } })
}
