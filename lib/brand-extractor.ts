import Anthropic from '@anthropic-ai/sdk'
import FirecrawlApp from '@mendable/firecrawl-js'
import { z } from 'zod'
import type { BrandProfile, Tone, ExtractBrandRequest } from '../types'

const BrandProfileSchema = z.object({
  name: z.string(),
  tagline: z.string().optional(),
  niche: z.string(),
  tone: z.enum(['professional', 'casual', 'playful', 'luxurious', 'educational']),
  targetAudience: z.string(),
  products: z.array(z.string()),
  colors: z.array(z.string()),
  keyMessages: z.array(z.string()),
})

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function scrapeUrl(url: string): Promise<string> {
  // Try Firecrawl first (better quality), fall back to native fetch
  if (process.env.FIRECRAWL_API_KEY) {
    try {
      const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })
      const result = await firecrawl.scrapeUrl(url, {
        formats: ['markdown'],
        onlyMainContent: true,
      })
      if (result.success && result.markdown) {
        return result.markdown.slice(0, 8000)
      }
    } catch {
      // fall through to native fetch
    }
  }

  // Native fetch fallback — strip HTML tags, keep readable text
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AllMarketing/1.0)' },
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const html = await res.text()
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return text.slice(0, 8000)
}

async function analyzeWithClaude(content: string, contentType: 'url' | 'photo' | 'manual' | 'social', imageBase64?: string, reelIdea?: string): Promise<BrandProfile> {
  const systemPrompt = `You are a brand analyst. Extract brand information and return ONLY valid JSON matching this schema:
{
  "name": string,
  "tagline": string | null,
  "niche": string (1-3 words, e.g. "fitness coaching", "luxury skincare"),
  "tone": "professional" | "casual" | "playful" | "luxurious" | "educational",
  "targetAudience": string (1-2 sentences),
  "products": string[] (list of main products/services, max 5),
  "colors": string[] (brand colors as hex codes if visible, or descriptive like "navy blue"),
  "keyMessages": string[] (3-5 core brand messages)
}
Return ONLY the JSON object. No markdown, no explanation.`

  const messages: Anthropic.MessageParam[] = []

  if (contentType === 'photo' && imageBase64) {
    const ideaContext = reelIdea
      ? `\n\nThe creator's reel idea: "${reelIdea}"\nUse this idea to infer brand tone, niche, and key messages that align with their intent.`
      : ''
    messages.push({
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/jpeg',
            data: imageBase64,
          },
        },
        {
          type: 'text',
          text: `Analyze this image and extract brand information. Infer brand name, niche, tone, products, and key messages from what you see.${ideaContext} Return JSON only.`,
        },
      ],
    })
  } else {
    messages.push({
      role: 'user',
      content: `Analyze this brand content and extract brand information:\n\n${content}\n\nReturn JSON only.`,
    })
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  // Strip any markdown code fences if present
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  const parsed = JSON.parse(cleaned)
  const validated = BrandProfileSchema.parse(parsed)

  return {
    ...validated,
    tagline: validated.tagline ?? undefined,
    extractedFrom: contentType,
  }
}

export async function extractBrand(req: ExtractBrandRequest): Promise<BrandProfile> {
  // Priority: URL > photo > manual fields
  if (req.url) {
    const scraped = await scrapeUrl(req.url)
    const brand = await analyzeWithClaude(scraped, 'url')
    return { ...brand, sourceUrl: req.url }
  }

  if (req.imageBase64) {
    return analyzeWithClaude('', 'photo', req.imageBase64, req.reelIdea)
  }

  if (req.socialUrl) {
    const scraped = await scrapeUrl(req.socialUrl)
    const brand = await analyzeWithClaude(scraped, 'social')
    return { ...brand, sourceUrl: req.socialUrl, extractedFrom: 'social' }
  }

  // Manual fallback — construct brand profile from provided fields
  if (req.brandName) {
    return {
      name: req.brandName,
      niche: req.brandNiche ?? 'general',
      tone: req.brandTone ?? 'professional',
      targetAudience: req.brandAudience ?? 'general audience',
      products: [],
      colors: [],
      keyMessages: [],
      extractedFrom: 'manual',
    }
  }

  throw new Error('At least one input (url, image, or brand name) is required')
}
