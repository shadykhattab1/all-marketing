import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/db'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const existing = await prisma.campaign.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  // Reuse existing token or mint a new one
  const token = existing.shareToken ?? randomUUID()

  if (!existing.shareToken) {
    await prisma.campaign.update({
      where: { id },
      data: { shareToken: token },
    })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const shareUrl = `${baseUrl}/campaigns/${token}`

  return NextResponse.json({ shareUrl })
}
