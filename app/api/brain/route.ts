import { parsePublicBrain } from '@/lib/public-brain'

export async function GET() {
  try {
    const response = await fetch('https://lukas.issahareb.me/api/public/lukas-brain', { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) })
    if (!response.ok) throw new Error('Unavailable')
    return Response.json(parsePublicBrain(await response.json()), { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' } })
  } catch {
    return Response.json({ error: 'Brain view temporarily unavailable' }, { status: 503, headers: { 'Retry-After': '60' } })
  }
}
