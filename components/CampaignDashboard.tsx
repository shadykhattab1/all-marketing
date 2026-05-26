'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, CheckCheck, Download, Plus, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ContentCard } from './ContentCard'
import { ReelCard } from './ReelCard'
import type { Campaign, CampaignContent } from '@/types'

interface CampaignDashboardProps {
  campaign: Campaign
}

type Tab = 'overview' | 'content' | 'reels' | 'share'

const CONTENT_CARDS: Array<{
  key: keyof CampaignContent
  title: string
  type: Parameters<typeof ContentCard>[0]['type']
}> = [
  { key: 'seo',           title: 'SEO Strategy',      type: 'seo' },
  { key: 'aeo',           title: 'AEO / AI Search',   type: 'aeo' },
  { key: 'blog',          title: 'Blog Article',       type: 'blog' },
  { key: 'ads',           title: 'Ad Copy',            type: 'ads' },
  { key: 'emailSequence', title: 'Email Sequence',     type: 'email' },
  { key: 'socialContent', title: 'Social Content',     type: 'social' },
  { key: 'websiteCopy',   title: 'Website Copy',       type: 'website-copy' },
  { key: 'contentCalendar', title: 'Content Calendar', type: 'calendar' },
  { key: 'competitors',   title: 'Competitor Analysis',type: 'competitors' },
  { key: 'seoComparison', title: 'SEO Comparison',     type: 'seo' },
  { key: 'brandKit',      title: 'Brand Kit',          type: 'brand-kit' },
]

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs font-medium text-zinc-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 animate-pulse">
      <div className="h-4 bg-zinc-800 rounded w-1/2" />
      <div className="h-3 bg-zinc-800 rounded w-3/4" />
      <div className="h-3 bg-zinc-800 rounded w-2/3" />
    </div>
  )
}

export function CampaignDashboard({ campaign }: CampaignDashboardProps) {
  const [tab, setTab] = useState<Tab>('overview')
  const [shareCopied, setShareCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const content = campaign.content ?? {}
  const reels = campaign.reels ?? []
  const brand = campaign.brandProfile
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/campaign/${campaign.shareToken ?? campaign.id}`
    : `/campaign/${campaign.shareToken ?? campaign.id}`

  const totalAssets = CONTENT_CARDS.filter(c => content[c.key] != null).length
  const totalReels = reels.length
  const createdAt = new Date(campaign.createdAt)
  const updatedAt = new Date(campaign.updatedAt)
  const genSeconds = Math.round((updatedAt.getTime() - createdAt.getTime()) / 1000)

  function copyShareLink() {
    navigator.clipboard.writeText(shareUrl)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(campaign, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-campaign.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'content',  label: `Content (${totalAssets})` },
    { id: 'reels',    label: `Reels (${totalReels})` },
    { id: 'share',    label: 'Share' },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Top bar */}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand identity */}
          <div className="flex items-center gap-3 min-w-0">
            {content.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.image}
                alt={brand.name}
                className="w-8 h-8 rounded-lg object-cover shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{brand.name}</p>
              <p className="text-xs text-zinc-500 truncate">{brand.niche}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { setTab('share'); setShareCopied(true); navigator.clipboard.writeText(shareUrl); setTimeout(() => setShareCopied(false), 2000) }}
              className="flex items-center gap-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              {shareCopied ? <CheckCheck className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
              Share
            </button>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs bg-[#1F4E79] hover:bg-[#2d6da3] text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Campaign
            </Link>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-6xl mx-auto px-6 flex gap-0.5 pb-0">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium transition-colors border-b-2',
                tab === t.id
                  ? 'text-white border-[#1F4E79]'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Overview ─────────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Content Assets" value={totalAssets} sub="of 11 generators" />
              <StatCard label="Reels Generated" value={totalReels} />
              <StatCard
                label="Campaign Status"
                value={campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              />
              {genSeconds > 0 && (
                <StatCard
                  label="Generation Time"
                  value={genSeconds >= 60 ? `${Math.round(genSeconds / 60)}m` : `${genSeconds}s`}
                />
              )}
            </div>

            {/* Brand profile card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                {content.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={content.image}
                    alt={brand.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-white">{brand.name}</h2>
                  {brand.tagline && <p className="text-sm text-[#2d6da3] italic mt-0.5">{brand.tagline}</p>}
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-zinc-500">
                    <span><span className="text-zinc-400">Niche:</span> {brand.niche}</span>
                    <span><span className="text-zinc-400">Tone:</span> {brand.tone}</span>
                    {brand.industry && <span><span className="text-zinc-400">Industry:</span> {brand.industry}</span>}
                  </div>
                  {brand.targetAudience && (
                    <p className="text-xs text-zinc-400 mt-2">{brand.targetAudience}</p>
                  )}
                  {brand.keyMessages.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {brand.keyMessages.slice(0, 4).map((msg, i) => (
                        <span key={i} className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded">
                          {msg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content completion overview */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Generated Assets</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CONTENT_CARDS.map(({ key, title, type }) => {
                  const has = content[key] != null
                  return (
                    <button
                      key={key}
                      onClick={() => setTab('content')}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border text-left transition-colors',
                        has
                          ? 'bg-zinc-900 border-zinc-700 hover:border-[#1F4E79]'
                          : 'bg-zinc-900/50 border-zinc-800 opacity-60',
                      )}
                    >
                      <span className={cn(
                        'w-2 h-2 rounded-full shrink-0',
                        has ? 'bg-green-500' : 'bg-zinc-700 animate-pulse',
                      )} />
                      <span className="text-xs text-zinc-300 font-medium truncate">{title}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Content ──────────────────────────────────────────────────── */}
        {tab === 'content' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {CONTENT_CARDS.map(({ key, title, type }) =>
              content[key] != null ? (
                <ContentCard
                  key={key}
                  title={title}
                  content={content[key]}
                  type={type}
                />
              ) : (
                <div key={key} className="relative">
                  <Skeleton />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs text-zinc-500 font-medium">{title}</p>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* ── Reels ─────────────────────────────────────────────────────── */}
        {tab === 'reels' && (
          <div>
            {reels.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-zinc-500 text-sm">No reels generated yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reels.map((reel, i) => (
                  <ReelCard
                    key={i}
                    reel={reel}
                    index={i + 1}
                    brandName={brand.name}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Share ─────────────────────────────────────────────────────── */}
        {tab === 'share' && (
          <div className="max-w-xl space-y-6">
            {/* Share link */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-1">Share Link</h3>
              <p className="text-xs text-zinc-500 mb-4">Anyone with this link can view this campaign dashboard.</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-zinc-800 text-zinc-300 px-3 py-2 rounded-lg overflow-x-auto whitespace-nowrap font-mono">
                  {shareUrl}
                </code>
                <button
                  onClick={copyShareLink}
                  className="flex items-center gap-1.5 bg-[#1F4E79] hover:bg-[#2d6da3] text-white text-xs px-3 py-2 rounded-lg transition-colors shrink-0"
                >
                  {linkCopied
                    ? <><CheckCheck className="w-3.5 h-3.5" /> Copied!</>
                    : <><Copy className="w-3.5 h-3.5" /> Copy</>
                  }
                </button>
              </div>
            </div>

            {/* Download JSON */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-1">Download Campaign Data</h3>
              <p className="text-xs text-zinc-500 mb-4">
                Export the full campaign as a JSON file — brand profile, all 11 content assets, and reel scripts.
              </p>
              <button
                onClick={downloadJson}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download campaign.json
              </button>
            </div>

            {/* Campaign metadata */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Campaign Info</h3>
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Campaign ID</dt>
                  <dd className="text-zinc-300 font-mono">{campaign.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Status</dt>
                  <dd className="text-zinc-300">{campaign.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Created</dt>
                  <dd className="text-zinc-300">{new Date(campaign.createdAt).toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Last updated</dt>
                  <dd className="text-zinc-300">{new Date(campaign.updatedAt).toLocaleString()}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
