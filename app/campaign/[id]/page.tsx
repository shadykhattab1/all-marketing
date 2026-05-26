import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { CampaignDashboard } from '@/components/CampaignDashboard'
import type { Campaign } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CampaignPage({ params }: PageProps) {
  const { id } = await params

  const row = await prisma.campaign.findFirst({
    where: {
      OR: [{ id }, { shareToken: id }],
    },
  })

  if (!row) notFound()

  const campaign: Campaign = {
    id: row.id,
    sessionId: row.sessionId,
    brandName: row.brandName,
    brandProfile: row.brandProfile as unknown as Campaign['brandProfile'],
    content: row.content as unknown as Campaign['content'],
    reels: row.reels as unknown as Campaign['reels'],
    status: row.status as Campaign['status'],
    shareToken: row.shareToken ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }

  return <CampaignDashboard campaign={campaign} />
}
