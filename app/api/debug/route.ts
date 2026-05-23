export async function GET() {
  const results: Record<string, unknown> = {}

  // Reddit
  try {
    const query = encodeURIComponent('CANVAS RFC1 cerebellar ataxia neuropathy vestibular')
    const res = await fetch(
      `https://www.reddit.com/search.json?q=${query}&sort=new&t=all&limit=5&type=link`,
      { headers: { 'User-Agent': 'web:life-under-canvas:1.0 (CANVAS syndrome information site)' } }
    )
    results.reddit_status = res.status
    const data = await res.json()
    results.reddit_count = data.data?.children?.length ?? 0
    results.reddit_titles = (data.data?.children ?? []).map((c: { data: { title: string } }) => c.data.title)
  } catch (e) {
    results.reddit_error = String(e)
  }

  // YouTube
  try {
    const apiKey = process.env.YOUTUBE_API_KEY
    results.youtube_key_present = !!apiKey
    if (apiKey) {
      const query = encodeURIComponent('CANVAS syndrome RFC1 cerebellar ataxia')
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&order=date&maxResults=3&key=${apiKey}`
      )
      results.youtube_status = res.status
      const data = await res.json()
      results.youtube_error = data.error ?? null
      results.youtube_count = data.items?.length ?? 0
    }
  } catch (e) {
    results.youtube_error = String(e)
  }

  return Response.json(results)
}
