import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import type { Prisma } from '@/lib/generated/prisma/client'

const CreateCampaignSchema = z.object({
  sessionId: z.string().min(1),
  brandName: z.string().min(1),
  brandProfile: z.record(z.unknown()),
  content: z.record(z.unknown()).optional(),
  reels: z.array(z.unknown()).optional(),
  status: z.enum(['draft', 'generating', 'complete', 'distributed']).optional(),
})

export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get('sessionId')

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  }

  const campaigns = await prisma.campaign.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return NextResponse.json({ campaigns })
}

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = CreateCampaignSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { sessionId, brandName, brandProfile, content, reels, status } = parsed.data

  type J = Prisma.InputJsonValue
  const campaign = await prisma.campaign.create({
    data: {
      sessionId,
      brandName,
      brandProfile: brandProfile as unknown as J,
      ...(content !== undefined && { content: content as unknown as J }),
      ...(reels !== undefined && { reels: reels as unknown as J }),
      ...(status !== undefined && { status }),
    },
  })

  return NextResponse.json({ campaign }, { status: 201 })
}
