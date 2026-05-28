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
  professional: 'clean corporate aesthetic, polished lighting, confident atmosphere, office environment',
  casual: 'warm natural lighting, relaxed lifestyle setting, candid feel',
  playful: 'vibrant colorful background, energetic dynamic composition',
  luxurious: 'cinematic bokeh, premium elegant interior, golden hour light',
  educational: 'clean bright studio, focused composition, modern workspace',
}

const NEGATIVE_PROMPT = 'blurry, low quality, text overlays, watermark, distorted faces, ugly'

function buildPrompt(brand: { name: string; niche: string; tone: string }, hook: string, body: string[]) {
  const style = TONE_STYLE[brand.tone] ?? 'cinematic professional quality'
  return [
    `Cinematic 9:16 vertical social media visual for ${brand.name}, a ${brand.niche} brand.`,
    `Concept: ${hook}. ${body.slice(0, 2).join('. ')}.`,
    `Style: ${style}.`,
    `High production value, shallow depth of field, no text, no watermarks.`,
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

function pollinationsUrl(prompt: string, seed?: number): string {
  const encoded = encodeURIComponent(prompt.slice(0, 500))
  const s = seed ?? (Date.now() % 99999)
  return `https://image.pollinations.ai/prompt/${encoded}?width=576&height=1024&nologo=true&model=flux&seed=${s}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { brand, hook, body: scriptBody, duration } = RequestSchema.parse(body)
    const prompt = buildPrompt(brand, hook, scriptBody)

    // ── Try Kling via fal.ai ──────────────────────────────────────────────────
    if (falConfigured) {
      try {
        const clipDuration: '5' | '10' = duration >= 10 ? '10' : '5'
        const { fal } = await import('@fal-ai/client')
        fal.config({ credentials: process.env.FAL_KEY })

        const result = await fal.subscribe('fal-ai/kling-video/v1.6/standard/text-to-video', {
          input: { prompt, duration: clipDuration, aspect_ratio: '9:16', negative_prompt: NEGATIVE_PROMPT },
          pollInterval: 5000,
        })

        const url = extractVideoUrl(result)
        if (url) {
          return NextResponse.json({ videoUrls: [url], type: 'video' })
        }
      } catch (falErr) {
        const msg = falErr instanceof Error ? falErr.message : String(falErr)
        const isBalance = msg.includes('balance') || msg.includes('403') || msg.includes('Forbidden') || msg.includes('locked')
        console.warn('[generate-video] fal failed, falling back to image preview:', isBalance ? 'balance exhausted' : msg)
        // Fall through to image fallback
      }
    }

    // ── Fallback: 5 Pollinations frames for client-side canvas video ─────────
    const seed = Date.now() % 99999
    const frames = [
      pollinationsUrl(`${prompt} opening establishing shot`, seed),
      pollinationsUrl(`${prompt} close-up product detail`, seed + 1111),
      pollinationsUrl(`${prompt} mid scene wide angle`, seed + 2222),
      pollinationsUrl(`${prompt} lifestyle moment candid`, seed + 3333),
      pollinationsUrl(`${prompt} closing hero shot brand`, seed + 4444),
    ]

    return NextResponse.json({
      frames,
      videoUrls: [],
      type: 'frames',
      note: 'Client-side video — 3 AI frames for canvas animation',
    })

  } catch (err) {
    console.error('[generate-video]', err)
    const message = err instanceof Error ? err.message : 'Generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
