import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import type { Prisma } from '@/lib/generated/prisma/client'

// cuid v1/v2 pattern: starts with 'c' followed by 25 alphanumeric chars
const CUID_RE = /^c[a-z0-9]{24,}$/i

const PatchCampaignSchema = z.object({
  sessionId: z.string().min(1).optional(),
  shareToken: z.string().min(1).optional(),
  content: z.record(z.unknown()).optional(),
  reels: z.array(z.unknown()).optional(),
  status: z.enum(['draft', 'generating', 'complete', 'distributed']).optional(),
})

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Try by id first if it looks like a cuid, otherwise fall through to shareToken
  if (CUID_RE.test(id)) {
    const campaign = await prisma.campaign.findUnique({ where: { id } })
    if (campaign) return NextResponse.json({ campaign })
  }

  // Fall back to shareToken lookup
  const campaign = await prisma.campaign.findUnique({ where: { shareToken: id } })
  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  return NextResponse.json({ campaign })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const parsed = PatchCampaignSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { sessionId, shareToken, content, reels, status } = parsed.data

  // Resolve the campaign
  const existing = await prisma.campaign.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  // Authorization: caller must supply a matching sessionId or a valid shareToken
  const sessionMatch = sessionId !== undefined && existing.sessionId === sessionId
  const tokenMatch =
    shareToken !== undefined &&
    existing.shareToken !== null &&
    existing.shareToken === shareToken

  if (!sessionMatch && !tokenMatch) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const campaign = await prisma.campaign.update({
    where: { id },
    data: {
      ...(content !== undefined && { content: content as Prisma.InputJsonValue }),
      ...(reels !== undefined && { reels: reels as Prisma.InputJsonValue }),
      ...(status !== undefined && { status }),
    },
  })

  return NextResponse.json({ campaign })
}
