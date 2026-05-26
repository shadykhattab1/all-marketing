import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateText, extractJson } from '../../../lib/claude'
import {
  buildAnalyzePrompt,
  buildBrandKitPrompt,
  buildSeoPrompt,
  buildBlogPrompt,
  buildAdsPrompt,
  buildEmailSequencePrompt,
  buildSocialContentPrompt,
  buildWebsiteCopyPrompt,
  buildContentCalendarPrompt,
  buildCompetitorAnalysisPrompt,
  buildSeoComparisonPrompt,
  JSON_SYSTEM_PROMPT,
} from '../../../lib/prompts/campaign'
import type {
  BrandProfile,
  BusinessProfile,
  CampaignContent,
  SeoData,
  AeoData,
  CompetitorAnalysis,
} from '../../../types'

// ─── Request validation ───────────────────────────────────────────────────────

const BrandProfileSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().optional(),
  niche: z.string().min(1),
  tone: z.enum(['professional', 'casual', 'playful', 'luxurious', 'educational']),
  targetAudience: z.string().min(1),
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
  sessionId: z.string().min(1),
  brand: BrandProfileSchema,
})

// ─── DALL-E image generation ──────────────────────────────────────────────────

async function generateImage(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
    }),
  })

  if (!res.ok) return null
  const data = (await res.json()) as { data?: { url?: string }[] }
  return data.data?.[0]?.url ?? null
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  // 1. Validate request
  let brand: BrandProfile
  let sessionId: string
  try {
    const body = await req.json()
    const parsed = RequestSchema.parse(body)
    brand = parsed.brand as BrandProfile
    sessionId = parsed.sessionId
  } catch (err) {
    const message = err instanceof z.ZodError ? err.errors[0]?.message : 'Invalid request body'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  // 2. Phase 1: derive BusinessProfile — everything downstream needs it
  let profile: BusinessProfile
  try {
    const raw = await generateText(JSON_SYSTEM_PROMPT, buildAnalyzePrompt(brand), 1024)
    profile = extractJson(raw) as BusinessProfile
    if (!profile?.summary) throw new Error('Invalid profile response')
  } catch (err) {
    console.error(`[generate-campaign:${sessionId}] analyze failed:`, err)
    return NextResponse.json({ error: 'Failed to analyze brand profile' }, { status: 500 })
  }

  // 3. Phase 2: SEO (needed by blog, social, calendar, seoComparison)
  let seoData: SeoData | null = null
  let aeoData: AeoData | null = null
  try {
    const raw = await generateText(JSON_SYSTEM_PROMPT, buildSeoPrompt(brand, profile), 3000)
    const parsed = extractJson(raw) as { seoData?: SeoData; aeoData?: AeoData } | null
    seoData = parsed?.seoData ?? null
    aeoData = parsed?.aeoData ?? null
  } catch (err) {
    console.error(`[generate-campaign:${sessionId}] seo failed:`, err)
  }

  // 4. Phase 3: run all remaining generators in parallel
  const competitorHint = brand.keyMessages.slice(0, 3).join(', ') || brand.niche

  type Task = [keyof CampaignContent, Promise<unknown>]

  const tasks: Task[] = [
    [
      'brandKit',
      generateText(JSON_SYSTEM_PROMPT, buildBrandKitPrompt(brand, profile), 2048)
        .then(r => extractJson(r)),
    ],
    [
      'ads',
      generateText(JSON_SYSTEM_PROMPT, buildAdsPrompt(brand, profile), 2048)
        .then(r => extractJson(r)),
    ],
    [
      'emailSequence',
      generateText(JSON_SYSTEM_PROMPT, buildEmailSequencePrompt(brand, profile), 3000)
        .then(r => extractJson(r)),
    ],
    [
      'websiteCopy',
      generateText(JSON_SYSTEM_PROMPT, buildWebsiteCopyPrompt(brand, profile), 2048)
        .then(r => extractJson(r)),
    ],
    [
      'competitors',
      generateText(JSON_SYSTEM_PROMPT, buildCompetitorAnalysisPrompt(brand, profile, competitorHint), 2048)
        .then(r => extractJson(r)),
    ],
    [
      'image',
      generateImage(`${brand.name}${brand.tagline ? ' — ' + brand.tagline : ''} brand hero image`),
    ],
  ]

  // SEO-dependent generators — only queue if seoData resolved
  if (seoData) {
    tasks.push(
      [
        'blog',
        generateText(JSON_SYSTEM_PROMPT, buildBlogPrompt(brand, profile, seoData), 4096)
          .then(r => extractJson(r)),
      ],
      [
        'socialContent',
        generateText(JSON_SYSTEM_PROMPT, buildSocialContentPrompt(brand, profile, seoData), 2048)
          .then(r => extractJson(r)),
      ],
      [
        'contentCalendar',
        generateText(JSON_SYSTEM_PROMPT, buildContentCalendarPrompt(brand, profile, seoData), 4096)
          .then(r => extractJson(r)),
      ],
    )
  }

  // seoComparison — only if websiteUrl present and seoData resolved
  if (brand.websiteUrl && seoData) {
    tasks.push([
      'seoComparison',
      generateText(
        JSON_SYSTEM_PROMPT,
        buildSeoComparisonPrompt(brand, profile, seoData, competitorHint),
        3000,
      ).then(r => extractJson(r)),
    ])
  }

  const keys = tasks.map(([k]) => k)
  const results = await Promise.allSettled(tasks.map(([, p]) => p))

  const campaign: CampaignContent = {
    seo: seoData ?? undefined,
    aeo: aeoData ?? undefined,
  }

  results.forEach((result, i) => {
    const key = keys[i]
    if (result.status === 'fulfilled' && result.value != null) {
      if (key === 'image') {
        campaign.image = result.value as string
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (campaign as any)[key] = result.value
      }
    } else if (result.status === 'rejected') {
      console.error(`[generate-campaign:${sessionId}] ${key} failed:`, result.reason)
    }
  })

  return NextResponse.json({ campaign })
}
