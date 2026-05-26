import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { generateScripts } from '@/lib/script-generator'
import { falConfigured } from '@/lib/fal'
import type { ReelResult, ReelScript } from '@/types'

export const maxDuration = 300

const BrandProfileSchema = z.object({
  name: z.string(),
  tagline: z.string().optional(),
  niche: z.string(),
  tone: z.enum(['professional', 'casual', 'playful', 'luxurious', 'educational']),
  targetAudience: z.string(),
  products: z.array(z.string()),
  colors: z.array(z.string()),
  keyMessages: z.array(z.string()),
  extractedFrom: z.enum(['url', 'photo', 'manual', 'social']),
  sourceUrl: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
  brandVoice: z.string().optional(),
  goals: z.string().optional(),
  websiteUrl: z.string().optional(),
  monthlyBudget: z.number().optional(),
  primaryGoal: z.enum(['leads', 'sales', 'awareness', 'followers']).optional(),
  contentRestrictions: z.string().optional(),
  idealCustomer: z.string().optional(),
  existingContent: z.string().optional(),
})

const RequestSchema = z.object({
  sessionId: z.string(),
  brand: BrandProfileSchema,
  count: z.number().int().min(1).max(5).default(3),
  reelIdea: z.string().optional(),
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

function buildPrompt(
  brandName: string,
  niche: string,
  hook: string,
  body: string[],
  tone: string,
  clipIndex: number,
  totalClips: number,
): string {
  const style = TONE_STYLE[tone] ?? 'cinematic professional quality'
  const sceneHint = body.slice(0, 2).join('. ')

  const partHint =
    totalClips === 1 ? '' :
    clipIndex === 0 ? 'Opening scene. ' :
    clipIndex === totalClips - 1 ? 'Closing scene with call-to-action energy. ' :
    `Continuation scene ${clipIndex + 1} of ${totalClips}. `

  return [
    `${partHint}Cinematic 9:16 vertical brand video for ${brandName}, a ${niche} brand.`,
    `Scene concept: ${hook}. ${sceneHint}.`,
    `Visual style: ${style}.`,
    `Smooth camera movement, shallow depth of field, high production value.`,
    `No text overlays, no watermarks. Realistic motion, natural lighting.`,
  ].join(' ')
}

function extractVideoUrl(result: unknown): string | undefined {
  if (!result || typeof result !== 'object') return undefined
  const r = result as Record<string, unknown>
  if (r.data && typeof r.data === 'object') {
    const found = extractVideoUrl(r.data)
    if (found) return found
  }
  if (r.video && typeof r.video === 'object') {
    const v = r.video as Record<string, unknown>
    if (typeof v.url === 'string') return v.url
  }
  if (Array.isArray(r.videos) && r.videos.length > 0) {
    const first = r.videos[0] as Record<string, unknown>
    if (typeof first.url === 'string') return first.url
  }
  if (r.output && typeof r.output === 'object') {
    const found = extractVideoUrl(r.output)
    if (found) return found
  }
  if (typeof r.url === 'string') return r.url
  return undefined
}

function computeClipDurations(totalDuration: number): ('5' | '10')[] {
  const clips: ('5' | '10')[] = []
  let remaining = totalDuration
  while (remaining > 0) {
    const d = remaining >= 10 ? 10 : 5
    clips.push(d === 10 ? '10' : '5')
    remaining -= d
  }
  return clips
}

async function generateReelVideos(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fal: { subscribe: (...args: any[]) => Promise<unknown> },
  script: ReelScript,
  brand: { name: string; niche: string; tone: string },
  duration: number,
  imageBase64?: string,
): Promise<string[]> {
  const clipDurations = computeClipDurations(duration)
  const totalClips = clipDurations.length

  const clipPromises = clipDurations.map((d, i) => {
    const prompt = buildPrompt(brand.name, brand.niche, script.hook, script.body, brand.tone, i, totalClips)
    return imageBase64
      ? fal.subscribe('fal-ai/kling-video/v1.6/standard/image-to-video', {
          input: { prompt, image_url: `data:image/jpeg;base64,${imageBase64}`, duration: d, negative_prompt: NEGATIVE_PROMPT },
          pollInterval: 5000,
        })
      : fal.subscribe('fal-ai/kling-video/v1.6/standard/text-to-video', {
          input: { prompt, duration: d, aspect_ratio: '9:16', negative_prompt: NEGATIVE_PROMPT },
          pollInterval: 5000,
        })
  })

  const results = await Promise.all(clipPromises)
  return results.map((result, i) => {
    const url = extractVideoUrl(result)
    if (!url) throw new Error(`No video URL for clip ${i} in Kling response`)
    return url
  })
}

async function generateReel(
  script: ReelScript,
  brand: { name: string; niche: string; tone: string },
  duration: number,
  imageBase64?: string,
): Promise<ReelResult> {
  const clipDurations = computeClipDurations(duration)

  if (!falConfigured) {
    return {
      script,
      videoUrls: [],
      totalClips: clipDurations.length,
      totalDuration: duration,
      status: 'complete',
    }
  }

  try {
    const { fal } = await import('@fal-ai/client')
    fal.config({ credentials: process.env.FAL_KEY })

    const videoUrls = await generateReelVideos(fal, script, brand, duration, imageBase64)
    return {
      script,
      videoUrls,
      totalClips: clipDurations.length,
      totalDuration: duration,
      status: 'complete',
    }
  } catch (error) {
    console.error('[generate-reels] video generation failed for script:', script.hookFormatId, error)
    return {
      script,
      videoUrls: [],
      totalClips: clipDurations.length,
      totalDuration: duration,
      status: 'failed',
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { brand, count, reelIdea, duration } = RequestSchema.parse(body)

    const scripts = await generateScripts(brand, count, [], reelIdea)

    const reelPromises = scripts.map((script) =>
      generateReel(script, { name: brand.name, niche: brand.niche, tone: brand.tone }, duration)
    )

    const settled = await Promise.allSettled(reelPromises)

    const reels: ReelResult[] = settled.map((result, i) => {
      if (result.status === 'fulfilled') return result.value
      console.error('[generate-reels] reel promise rejected:', i, result.reason)
      return {
        script: scripts[i],
        videoUrls: [],
        totalClips: computeClipDurations(duration).length,
        totalDuration: duration,
        status: 'failed' as const,
      }
    })

    return NextResponse.json({ reels })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : 'Reel generation failed'
    console.error('[generate-reels]', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
