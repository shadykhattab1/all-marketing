import { NextResponse } from 'next/server'
import { z } from 'zod'
import { extractBrand } from '@/lib/brand-extractor'
import type { BrandProfile } from '@/types'

const RequestSchema = z.object({
  url: z.string().url().optional(),
  imageBase64: z.string().optional(),
  brandName: z.string().optional(),
  brandNiche: z.string().optional(),
  brandTone: z.enum(['professional', 'casual', 'playful', 'luxurious', 'educational']).optional(),
  brandAudience: z.string().optional(),
  socialUrl: z.string().url().optional(),
  reelIdea: z.string().optional(),
  sessionId: z.string().optional(),
}).refine(
  data => data.url || data.imageBase64 || data.brandName || data.socialUrl,
  { message: 'At least one input source is required' }
)

export async function POST(req: Request) {
  let sessionId: string | undefined

  try {
    const body = await req.json()
    const input = RequestSchema.parse(body)
    sessionId = input.sessionId

    const brand: BrandProfile = await extractBrand(input)

    return NextResponse.json({ brand, ...(sessionId !== undefined && { sessionId }) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }
    const message = error instanceof Error ? error.message : 'Brand extraction failed'
    console.error('[analyze-brand]', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
