import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { falConfigured } from '@/lib/fal'

export const maxDuration = 300

const RequestSchema = z.object({
  brand: z.object({
    name: z.string(),
    niche: z.string(),
    tone: z.string(),
  }),
  hook: z.string(),
  body: z.array(z.string()),
  duration: z.number().int().min(5).max(30).default(15),
})

const TONE_STYLE: Record<string, string> = {
  professional: 'clean corporate aesthetic, polished lighting, confident atmosphere',
  casual: 'warm natural lighting, relaxed candid feel, lifestyle vibe',
  playful: 'vibrant colors, energetic movement, fun dynamic angles',
  luxurious: 'cinematic lighting, slow elegant motion, premium bokeh',
  educational: 'clean bright environment, focused close-ups, informative flow',
}

const NEGATIVE_PROMPT = 'blurry, low quality, text overlays, watermark, static, frozen, distorted'

function buildPrompt(brand: { name: string; niche: string; tone: string }, hook: string, body: string[]) {
  const style = TONE_STYLE[brand.tone] ?? 'cinematic professional quality'
  return [
    `Cinematic 9:16 vertical brand video for ${brand.name}, a ${brand.niche} brand.`,
    `Scene concept: ${hook}. ${body.slice(0, 2).join('. ')}.`,
    `Visual style: ${style}.`,
    `Smooth camera movement, shallow depth of field, high production value.`,
    `No text overlays, no watermarks. Realistic motion, natural lighting.`,
  ].join(' ')
}

function extractVideoUrl(result: unknown): string | undefined {
  if (!result || typeof result !== 'object') return undefined
  const r = result as Record<string, unknown>
  if (r.data && typeof r.data === 'object') { const f = extractVideoUrl(r.data); if (f) return f }
  if (r.video && typeof r.video === 'object') { const v = r.video as Record<string, unknown>; if (typeof v.url === 'string') return v.url }
  if (Array.isArray(r.videos) && r.videos.length > 0) { const first = r.videos[0] as Record<string, unknown>; if (typeof first.url === 'string') return first.url }
  if (r.output && typeof r.output === 'object') { const f = extractVideoUrl(r.output); if (f) return f }
  if (typeof r.url === 'string') return r.url
  return undefined
}

export async function POST(req: NextRequest) {
  if (!falConfigured) {
    return NextResponse.json({ error: 'Video generation not configured (FAL_KEY missing)' }, { status: 503 })
  }

  try {
    const body = await req.json()
    const { brand, hook, body: scriptBody, duration } = RequestSchema.parse(body)
    const prompt = buildPrompt(brand, hook, scriptBody)

    // Generate a single clip (5s or 10s) — keep within timeout budget
    const clipDuration: '5' | '10' = duration >= 10 ? '10' : '5'

    const { fal } = await import('@fal-ai/client')
    fal.config({ credentials: process.env.FAL_KEY })

    const result = await fal.subscribe('fal-ai/kling-video/v1.6/standard/text-to-video', {
      input: { prompt, duration: clipDuration, aspect_ratio: '9:16', negative_prompt: NEGATIVE_PROMPT },
      pollInterval: 5000,
    })

    const url = extractVideoUrl(result)
    if (!url) {
      return NextResponse.json({ error: 'No video URL in Kling response' }, { status: 500 })
    }

    return NextResponse.json({ videoUrls: [url] })
  } catch (err) {
    console.error('[generate-video]', err)
    const message = err instanceof Error ? err.message : 'Video generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
