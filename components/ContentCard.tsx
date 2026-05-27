'use client'

import { useState } from 'react'
import { Copy, CheckCheck, ChevronDown, ChevronUp, FileText, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

type ContentType =
  | 'seo'
  | 'blog'
  | 'ads'
  | 'email'
  | 'social'
  | 'brand-kit'
  | 'website-copy'
  | 'calendar'
  | 'competitors'
  | 'aeo'
  | 'catalogue'
  | 'sales-kit'

interface ContentCardProps {
  title: string
  content: unknown
  type: ContentType
  onCopy?: () => void
}

const TYPE_ICONS: Record<ContentType, string> = {
  seo: '🔍',
  blog: '📝',
  ads: '📢',
  email: '📨',
  social: '📱',
  'brand-kit': '🎨',
  'website-copy': '🌐',
  calendar: '📅',
  competitors: '⚔️',
  aeo: '🤖',
  catalogue: '📋',
  'sales-kit': '🤝',
}

function formatForCopy(content: unknown): string {
  if (typeof content === 'string') return content
  return JSON.stringify(content, null, 2)
}

// ─── Section helpers ──────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">{label}</p>
      {children}
    </div>
  )
}

function Tag({ children, color = 'blue' }: { children: React.ReactNode; color?: 'blue' | 'green' | 'zinc' | 'amber' }) {
  const styles = {
    blue: 'bg-[#1F4E79]/30 border-[#1F4E79]/50 text-blue-300',
    green: 'bg-green-900/30 border-green-700/50 text-green-300',
    zinc: 'bg-zinc-800 border-zinc-700 text-zinc-300',
    amber: 'bg-amber-900/30 border-amber-700/50 text-amber-300',
  }
  return (
    <span className={cn('border text-xs px-2 py-0.5 rounded-full', styles[color])}>
      {children}
    </span>
  )
}

function BulletList({ items, max }: { items: string[]; max?: number }) {
  const shown = max ? items.slice(0, max) : items
  return (
    <ul className="space-y-1">
      {shown.map((item, i) => (
        <li key={i} className="flex gap-2 text-xs text-zinc-300">
          <span className="text-[#2d6da3] shrink-0 mt-0.5">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

// ─── Full expanded views ──────────────────────────────────────────────────────

function SeoFull({ d }: { d: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      {!!d.metaTitle && <Section label="Meta Title"><p className="text-sm font-semibold text-white">{String(d.metaTitle)}</p></Section>}
      {!!d.metaDescription && <Section label="Meta Description"><p className="text-xs text-zinc-300 leading-relaxed">{String(d.metaDescription)}</p></Section>}
      {Array.isArray(d.primaryKeywords) && (
        <Section label="Primary Keywords">
          <div className="flex flex-wrap gap-1.5">{(d.primaryKeywords as string[]).map((k,i) => <Tag key={i} color="blue">{k}</Tag>)}</div>
        </Section>
      )}
      {Array.isArray(d.secondaryKeywords) && (
        <Section label="Secondary Keywords">
          <div className="flex flex-wrap gap-1.5">{(d.secondaryKeywords as string[]).map((k,i) => <Tag key={i} color="zinc">{k}</Tag>)}</div>
        </Section>
      )}
      {Array.isArray(d.longTailKeywords) && (
        <Section label="Long-tail Keywords">
          <div className="flex flex-wrap gap-1.5">{(d.longTailKeywords as string[]).map((k,i) => <Tag key={i} color="zinc">{k}</Tag>)}</div>
        </Section>
      )}
      {Array.isArray(d.contentOutline) && (
        <Section label="Content Outline"><BulletList items={d.contentOutline as string[]} /></Section>
      )}
    </div>
  )
}

function BlogFull({ d }: { d: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      {!!d.title && <Section label="Title"><p className="text-sm font-semibold text-white">{String(d.title)}</p></Section>}
      {!!d.metaDescription && <Section label="Meta Description"><p className="text-xs text-zinc-300 leading-relaxed">{String(d.metaDescription)}</p></Section>}
      {Array.isArray(d.outline) && <Section label="Outline"><BulletList items={d.outline as string[]} /></Section>}
      {!!d.fullArticle && (
        <Section label="Full Article">
          <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap bg-zinc-800/50 rounded-lg p-3 max-h-64 overflow-y-auto">
            {String(d.fullArticle)}
          </div>
        </Section>
      )}
      <div className="flex gap-4 text-xs text-zinc-500">
        {!!d.targetKeyword && <span>Keyword: <span className="text-zinc-300">{String(d.targetKeyword)}</span></span>}
        {!!d.wordCount && <span>~{String(d.wordCount)} words</span>}
        {!!d.suggestedSlug && <span className="font-mono text-zinc-600">/{String(d.suggestedSlug)}</span>}
      </div>
    </div>
  )
}

function AdsFull({ d }: { d: Record<string, unknown> }) {
  const googleAds = Array.isArray(d.googleAds) ? d.googleAds as Record<string,unknown>[] : []
  const metaAds = Array.isArray(d.metaAds) ? d.metaAds as Record<string,unknown>[] : []
  return (
    <div className="space-y-4">
      {googleAds.length > 0 && (
        <Section label="Google Ads">
          <div className="space-y-3">
            {googleAds.map((ad, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-[10px] text-zinc-500 mb-1.5">Variant {i+1}</p>
                {Array.isArray(ad.headlines) && (ad.headlines as string[]).map((h,j) => (
                  <p key={j} className="text-sm text-blue-400 font-medium">{h}</p>
                ))}
                {Array.isArray(ad.descriptions) && (ad.descriptions as string[]).map((d,j) => (
                  <p key={j} className="text-xs text-zinc-400 mt-1">{d}</p>
                ))}
              </div>
            ))}
          </div>
        </Section>
      )}
      {metaAds.length > 0 && (
        <Section label="Meta Ads">
          <div className="space-y-3">
            {metaAds.map((ad, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-[10px] text-zinc-500 mb-1.5">Variant {i+1} · {String(ad.ctaButton ?? '')}</p>
                {!!ad.primaryText && <p className="text-xs text-zinc-300 mb-1.5">{String(ad.primaryText)}</p>}
                {!!ad.headline && <p className="text-sm font-semibold text-white">{String(ad.headline)}</p>}
                {!!ad.description && <p className="text-xs text-zinc-500">{String(ad.description)}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}
      {!!d.targetAudience && <Section label="Targeting"><p className="text-xs text-zinc-300">{String(d.targetAudience)}</p></Section>}
    </div>
  )
}

function EmailFull({ d }: { d: Record<string, unknown> }) {
  const emails = Array.isArray(d.emails) ? d.emails as Record<string,unknown>[] : []
  return (
    <div className="space-y-4">
      {!!d.sequenceName && <Section label="Sequence"><p className="text-sm font-semibold text-white">{String(d.sequenceName)}</p></Section>}
      {!!d.goal && <Section label="Goal"><p className="text-xs text-zinc-300">{String(d.goal)}</p></Section>}
      <Section label={`Emails (${emails.length})`}>
        <div className="space-y-3">
          {emails.map((email, i) => (
            <div key={i} className="bg-zinc-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-zinc-300">{String(email.subject ?? '')}</p>
                <Tag color="zinc">Day {String(email.day ?? i)}</Tag>
              </div>
              {!!email.previewText && <p className="text-[10px] text-zinc-500 mb-1.5 italic">{String(email.previewText)}</p>}
              {!!email.body && <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{String(email.body)}</p>}
              {!!email.cta && <p className="text-xs text-[#2d6da3] font-medium mt-1.5">→ {String(email.cta)}</p>}
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function SocialFull({ d }: { d: Record<string, unknown> }) {
  const platforms = ['instagram', 'twitter', 'linkedin'] as const
  return (
    <div className="space-y-4">
      {platforms.map(p => {
        const plat = d[p] as Record<string,unknown> | undefined
        if (!plat) return null
        return (
          <Section key={p} label={p.charAt(0).toUpperCase() + p.slice(1)}>
            <div className="bg-zinc-800/50 rounded-lg p-3 space-y-2">
              {!!plat.postText && <p className="text-xs text-zinc-300 leading-relaxed">{String(plat.postText)}</p>}
              {Array.isArray(plat.hashtags) && (
                <div className="flex flex-wrap gap-1">
                  {(plat.hashtags as string[]).slice(0,8).map((h,i) => (
                    <span key={i} className="text-[10px] text-[#2d6da3]">{h.startsWith('#') ? h : `#${h}`}</span>
                  ))}
                </div>
              )}
              {!!plat.characterCount && <p className="text-[10px] text-zinc-600">{String(plat.characterCount)} characters</p>}
            </div>
          </Section>
        )
      })}
    </div>
  )
}

function BrandKitFull({ d }: { d: Record<string, unknown> }) {
  const colors = Array.isArray(d.colors) ? d.colors as Record<string,string>[] : []
  return (
    <div className="space-y-4">
      {colors.length > 0 && (
        <Section label="Colors">
          <div className="grid grid-cols-3 gap-2">
            {colors.map((c, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-lg p-2">
                <div className="w-full h-8 rounded mb-1.5 border border-zinc-700" style={{ backgroundColor: c.hex }} />
                <p className="text-xs font-medium text-zinc-300">{c.name}</p>
                <p className="text-[10px] font-mono text-zinc-500">{c.hex}</p>
                <p className="text-[10px] text-zinc-600 mt-0.5">{c.usage}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
      {!!d.primaryFont && (
        <Section label="Typography">
          <p className="text-xs text-zinc-300">{String(d.primaryFont)} + {String(d.secondaryFont ?? '')}</p>
          {!!d.fontPairingRationale && <p className="text-xs text-zinc-500 mt-1">{String(d.fontPairingRationale)}</p>}
        </Section>
      )}
      {!!d.brandGuidelines && <Section label="Brand Guidelines"><p className="text-xs text-zinc-400 leading-relaxed">{String(d.brandGuidelines)}</p></Section>}
      {Array.isArray(d.doList) && <Section label="Do"><BulletList items={d.doList as string[]} /></Section>}
      {Array.isArray(d.dontList) && <Section label="Don't"><BulletList items={d.dontList as string[]} /></Section>}
    </div>
  )
}

function WebsiteCopyFull({ d }: { d: Record<string, unknown> }) {
  const features = Array.isArray(d.features) ? d.features as Record<string,string>[] : []
  return (
    <div className="space-y-4">
      {!!d.heroHeadline && <Section label="Hero Headline"><p className="text-lg font-bold text-white">{String(d.heroHeadline)}</p></Section>}
      {!!d.heroSubheadline && <Section label="Subheadline"><p className="text-xs text-zinc-300 leading-relaxed">{String(d.heroSubheadline)}</p></Section>}
      {!!d.tagline && <Section label="Tagline"><p className="text-sm text-[#2d6da3] italic">{String(d.tagline)}</p></Section>}
      {!!d.aboutSection && <Section label="About"><p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-line">{String(d.aboutSection)}</p></Section>}
      {features.length > 0 && (
        <Section label="Features">
          <div className="space-y-2">
            {features.map((f, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-lg p-2.5">
                <p className="text-xs font-semibold text-zinc-300">{f.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{f.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
      {!!d.ctaText && (
        <Section label="CTA">
          <span className="inline-block bg-[#1F4E79] text-white text-sm font-medium px-4 py-1.5 rounded-lg">{String(d.ctaText)}</span>
          {!!d.ctaSubtext && <p className="text-xs text-zinc-500 mt-1">{String(d.ctaSubtext)}</p>}
        </Section>
      )}
    </div>
  )
}

function CalendarFull({ d }: { d: Record<string, unknown> }) {
  const entries = Array.isArray(d.entries) ? d.entries as Record<string,unknown>[] : []
  return (
    <div className="space-y-4">
      {!!d.month && <Section label="Month"><p className="text-sm font-semibold text-white">{String(d.month)}</p></Section>}
      {!!d.theme && <Section label="Theme"><p className="text-xs text-zinc-300">{String(d.theme)}</p></Section>}
      <Section label={`Entries (${entries.length})`}>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {entries.map((e, i) => (
            <div key={i} className="bg-zinc-800/50 rounded-lg p-2.5 flex gap-3">
              <div className="shrink-0">
                <p className="text-[10px] text-zinc-500">{String(e.day ?? '')}</p>
                <Tag color="zinc">{String(e.platform ?? '')}</Tag>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-300">{String(e.topic ?? '')}</p>
                {!!e.captionDraft && <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2">{String(e.captionDraft)}</p>}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function CompetitorsFull({ d }: { d: Record<string, unknown> }) {
  const competitors = Array.isArray(d.competitors) ? d.competitors as Record<string,unknown>[] : []
  return (
    <div className="space-y-4">
      {competitors.length > 0 && (
        <Section label="Competitors">
          <div className="space-y-3">
            {competitors.map((c, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-zinc-200 mb-2">{String(c.name ?? '')}</p>
                {Array.isArray(c.strengths) && <div className="mb-1.5"><p className="text-[10px] text-green-500 uppercase tracking-wider mb-1">Strengths</p><BulletList items={c.strengths as string[]} /></div>}
                {Array.isArray(c.weaknesses) && <div><p className="text-[10px] text-red-500 uppercase tracking-wider mb-1">Weaknesses</p><BulletList items={c.weaknesses as string[]} /></div>}
              </div>
            ))}
          </div>
        </Section>
      )}
      {Array.isArray(d.positioningGaps) && <Section label="Positioning Gaps"><BulletList items={d.positioningGaps as string[]} /></Section>}
      {Array.isArray(d.strategicRecommendations) && <Section label="Recommendations"><BulletList items={d.strategicRecommendations as string[]} /></Section>}
    </div>
  )
}

function AeoFull({ d }: { d: Record<string, unknown> }) {
  const qas = Array.isArray(d.questionsAndAnswers) ? d.questionsAndAnswers as Record<string,string>[] : []
  return (
    <div className="space-y-4">
      {!!d.aiSearchSummary && <Section label="AI Search Summary"><p className="text-xs text-zinc-300 leading-relaxed">{String(d.aiSearchSummary)}</p></Section>}
      <Section label={`Q&A Pairs (${qas.length})`}>
        <div className="space-y-3">
          {qas.map((qa, i) => (
            <div key={i} className="bg-zinc-800/50 rounded-lg p-3">
              <p className="text-xs font-semibold text-zinc-200 mb-1">{qa.question}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{qa.answer}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function CatalogueFull({ d }: { d: Record<string, unknown> }) {
  const products = Array.isArray(d.products) ? d.products as Record<string,unknown>[] : []
  const testimonial = d.testimonial as Record<string,string> | undefined
  return (
    <div className="space-y-4">
      {!!d.coverTitle && <Section label="Cover Title"><p className="text-lg font-bold text-white">{String(d.coverTitle)}</p></Section>}
      {!!d.coverTagline && <Section label="Tagline"><p className="text-sm text-[#2d6da3] italic">{String(d.coverTagline)}</p></Section>}
      {!!d.companyOverview && <Section label="Company Overview"><p className="text-xs text-zinc-300 leading-relaxed">{String(d.companyOverview)}</p></Section>}
      {products.length > 0 && (
        <Section label={`Products / Services (${products.length})`}>
          <div className="space-y-3">
            {products.map((p, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-lg p-3">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-sm font-semibold text-zinc-200">{String(p.name ?? '')}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    {!!p.highlight && <Tag color="amber">{String(p.highlight)}</Tag>}
                    {!!p.price && <span className="text-sm font-bold text-green-400">{String(p.price)}</span>}
                  </div>
                </div>
                {!!p.description && <p className="text-xs text-zinc-400 mb-2">{String(p.description)}</p>}
                {Array.isArray(p.features) && (
                  <div className="flex flex-wrap gap-1">
                    {(p.features as string[]).map((f,j) => <Tag key={j} color="zinc">{f}</Tag>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
      {Array.isArray(d.whyChooseUs) && <Section label="Why Choose Us"><BulletList items={d.whyChooseUs as string[]} /></Section>}
      {testimonial && (
        <Section label="Testimonial">
          <div className="bg-zinc-800/50 rounded-lg p-3 border-l-2 border-[#1F4E79]">
            <p className="text-xs text-zinc-300 italic mb-2">"{testimonial.quote}"</p>
            <p className="text-[10px] text-zinc-500">— {testimonial.author}, {testimonial.company}</p>
          </div>
        </Section>
      )}
      {!!d.contactCta && <Section label="CTA"><p className="text-sm font-medium text-white">{String(d.contactCta)}</p></Section>}
    </div>
  )
}

function SalesKitFull({ d }: { d: Record<string, unknown> }) {
  const slides = Array.isArray(d.slides) ? d.slides as Record<string,unknown>[] : []
  const pricing = Array.isArray(d.pricing) ? d.pricing as Record<string,string>[] : []
  return (
    <div className="space-y-4">
      {!!d.executiveSummary && <Section label="Executive Summary"><p className="text-xs text-zinc-300 leading-relaxed">{String(d.executiveSummary)}</p></Section>}
      {!!d.problem && <Section label="The Problem"><p className="text-xs text-zinc-300 leading-relaxed">{String(d.problem)}</p></Section>}
      {!!d.solution && <Section label="Our Solution"><p className="text-xs text-zinc-300 leading-relaxed">{String(d.solution)}</p></Section>}
      {Array.isArray(d.differentiators) && <Section label="Why Us"><BulletList items={d.differentiators as string[]} /></Section>}
      {pricing.length > 0 && (
        <Section label="Pricing">
          <div className="space-y-2">
            {pricing.map((tier, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-lg p-2.5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-200">{tier.tier}</p>
                  <p className="text-[10px] text-zinc-500">{tier.summary}</p>
                </div>
                <span className="text-sm font-bold text-green-400">{tier.price}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
      {!!d.socialProof && <Section label="Social Proof"><p className="text-xs text-zinc-300 leading-relaxed">{String(d.socialProof)}</p></Section>}
      {!!d.cta && <Section label="Next Step"><p className="text-sm font-semibold text-[#2d6da3]">→ {String(d.cta)}</p></Section>}
      {slides.length > 0 && (
        <Section label={`Slide Deck (${slides.length} slides)`}>
          <div className="space-y-2">
            {slides.map((slide, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-lg p-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-zinc-600 font-mono">#{i+1}</span>
                  <p className="text-xs font-semibold text-zinc-300">{String(slide.title ?? '')}</p>
                  {!!slide.stat && <Tag color="blue">{String(slide.stat)} {String(slide.statLabel ?? '')}</Tag>}
                </div>
                {!!slide.content && <p className="text-[10px] text-zinc-500 mb-1">{String(slide.content)}</p>}
                {Array.isArray(slide.bullets) && (slide.bullets as string[]).length > 0 && (
                  <BulletList items={slide.bullets as string[]} />
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

// ─── Preview (collapsed) ──────────────────────────────────────────────────────

function ContentPreview({ content, type }: { content: unknown; type: ContentType }) {
  if (content === null || content === undefined) return null
  if (typeof content !== 'object') return <p className="text-xs text-zinc-400">{String(content)}</p>
  const d = content as Record<string, unknown>

  if (type === 'seo') return (
    <div className="space-y-2">
      {!!d.metaTitle && <p className="text-sm font-semibold text-white">{String(d.metaTitle)}</p>}
      {!!d.metaDescription && <p className="text-xs text-zinc-400 leading-relaxed">{String(d.metaDescription)}</p>}
      {Array.isArray(d.primaryKeywords) && (
        <div className="flex flex-wrap gap-1.5">
          {(d.primaryKeywords as string[]).slice(0,5).map((k,i) => <Tag key={i} color="blue">{k}</Tag>)}
        </div>
      )}
    </div>
  )

  if (type === 'blog') return (
    <div className="space-y-1.5">
      {!!d.title && <p className="text-sm font-semibold text-white">{String(d.title)}</p>}
      {!!d.metaDescription && <p className="text-xs text-zinc-400 line-clamp-2">{String(d.metaDescription)}</p>}
      {!!d.wordCount && <p className="text-xs text-zinc-600">~{String(d.wordCount)} words</p>}
    </div>
  )

  if (type === 'ads') {
    const first = (Array.isArray(d.googleAds) ? d.googleAds[0] : null) as Record<string,unknown> | null
    return (
      <div className="space-y-1.5">
        {first && Array.isArray(first.headlines) && (first.headlines as string[]).slice(0,2).map((h,i) => (
          <p key={i} className="text-sm text-blue-400 font-medium">{h}</p>
        ))}
        {!!d.targetAudience && <p className="text-xs text-zinc-500 line-clamp-1">{String(d.targetAudience)}</p>}
      </div>
    )
  }

  if (type === 'email') return (
    <div className="space-y-1.5">
      {!!d.sequenceName && <p className="text-sm font-semibold text-white">{String(d.sequenceName)}</p>}
      {!!d.goal && <p className="text-xs text-zinc-400 line-clamp-2">{String(d.goal)}</p>}
      {Array.isArray(d.emails) && <p className="text-xs text-zinc-600">{d.emails.length} emails in sequence</p>}
    </div>
  )

  if (type === 'social') {
    const ig = d.instagram as Record<string,unknown> | undefined
    return (
      <div className="space-y-1.5">
        {!!ig?.postText && <p className="text-xs text-zinc-300 line-clamp-3">{String(ig.postText)}</p>}
        <p className="text-xs text-zinc-600">Instagram · Twitter · LinkedIn</p>
      </div>
    )
  }

  if (type === 'brand-kit') {
    const colors = Array.isArray(d.colors) ? d.colors as Record<string,string>[] : []
    return (
      <div className="space-y-2">
        {colors.length > 0 && (
          <div className="flex gap-2">
            {colors.slice(0,5).map((c,i) => (
              <div key={i} className="text-center">
                <div className="w-8 h-8 rounded-lg border border-zinc-700" style={{ backgroundColor: c.hex }} />
                <p className="text-[10px] text-zinc-600 font-mono mt-0.5">{c.hex}</p>
              </div>
            ))}
          </div>
        )}
        {!!d.primaryFont && <p className="text-xs text-zinc-400">{String(d.primaryFont)} + {String(d.secondaryFont ?? '')}</p>}
      </div>
    )
  }

  if (type === 'website-copy') return (
    <div className="space-y-1.5">
      {!!d.heroHeadline && <p className="text-sm font-bold text-white">{String(d.heroHeadline)}</p>}
      {!!d.tagline && <p className="text-xs text-[#2d6da3] italic">{String(d.tagline)}</p>}
      {!!d.ctaText && <span className="inline-block bg-[#1F4E79] text-white text-xs px-3 py-1 rounded-lg">{String(d.ctaText)}</span>}
    </div>
  )

  if (type === 'calendar') {
    const entries = Array.isArray(d.entries) ? d.entries : []
    return (
      <div className="space-y-1.5">
        {!!d.month && <p className="text-sm font-semibold text-white">{String(d.month)}</p>}
        {!!d.theme && <p className="text-xs text-zinc-400">Theme: {String(d.theme)}</p>}
        <p className="text-xs text-zinc-600">{entries.length} entries planned</p>
      </div>
    )
  }

  if (type === 'competitors') {
    const comps = Array.isArray(d.competitors) ? d.competitors as Record<string,unknown>[] : []
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {comps.map((c,i) => <Tag key={i} color="zinc">{String(c.name ?? '')}</Tag>)}
        </div>
        {Array.isArray(d.positioningGaps) && <p className="text-xs text-zinc-500">{(d.positioningGaps as string[]).length} positioning gaps</p>}
      </div>
    )
  }

  if (type === 'aeo') {
    const qas = Array.isArray(d.questionsAndAnswers) ? d.questionsAndAnswers as Record<string,string>[] : []
    return (
      <div className="space-y-2">
        {qas.slice(0,2).map((qa,i) => (
          <div key={i}>
            <p className="text-xs font-medium text-zinc-300">{qa.question}</p>
            <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{qa.answer}</p>
          </div>
        ))}
        {qas.length > 2 && <p className="text-xs text-zinc-600">+{qas.length-2} more</p>}
      </div>
    )
  }

  if (type === 'catalogue') {
    const products = Array.isArray(d.products) ? d.products as Record<string,unknown>[] : []
    return (
      <div className="space-y-2">
        {!!d.coverTitle && <p className="text-sm font-bold text-white">{String(d.coverTitle)}</p>}
        {!!d.coverTagline && <p className="text-xs text-[#2d6da3] italic">{String(d.coverTagline)}</p>}
        <p className="text-xs text-zinc-600">{products.length} products / services</p>
      </div>
    )
  }

  if (type === 'sales-kit') {
    const slides = Array.isArray(d.slides) ? d.slides : []
    return (
      <div className="space-y-2">
        {!!d.executiveSummary && <p className="text-xs text-zinc-300 line-clamp-2">{String(d.executiveSummary)}</p>}
        {!!d.cta && <p className="text-xs text-[#2d6da3] font-medium">→ {String(d.cta)}</p>}
        <p className="text-xs text-zinc-600">{slides.length}-slide deck</p>
      </div>
    )
  }

  return null
}

// ─── Full expanded renderer ───────────────────────────────────────────────────

function ContentFull({ content, type }: { content: unknown; type: ContentType }) {
  if (!content || typeof content !== 'object') return null
  const d = content as Record<string, unknown>
  switch (type) {
    case 'seo':          return <SeoFull d={d} />
    case 'blog':         return <BlogFull d={d} />
    case 'ads':          return <AdsFull d={d} />
    case 'email':        return <EmailFull d={d} />
    case 'social':       return <SocialFull d={d} />
    case 'brand-kit':    return <BrandKitFull d={d} />
    case 'website-copy': return <WebsiteCopyFull d={d} />
    case 'calendar':     return <CalendarFull d={d} />
    case 'competitors':  return <CompetitorsFull d={d} />
    case 'aeo':          return <AeoFull d={d} />
    case 'catalogue':    return <CatalogueFull d={d} />
    case 'sales-kit':    return <SalesKitFull d={d} />
    default:             return null
  }
}

// ─── Card shell ───────────────────────────────────────────────────────────────

export function ContentCard({ title, content, type, onCopy }: ContentCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const isEmpty = content === null || content === undefined

  function handleCopy() {
    navigator.clipboard.writeText(formatForCopy(content))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopy?.()
  }

  const isDoc = type === 'catalogue' || type === 'sales-kit'

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
      <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-base">{TYPE_ICONS[type]}</span>
          <span className="text-sm font-semibold text-white">{title}</span>
          {isDoc && !isEmpty && (
            <span className="text-[10px] bg-[#1F4E79]/30 text-blue-300 border border-[#1F4E79]/40 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              Export
            </span>
          )}
        </div>
        {!isEmpty && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors"
          >
            {copied
              ? <><CheckCheck className="w-3.5 h-3.5 text-green-400" /> Copied</>
              : <><Copy className="w-3.5 h-3.5" /> Copy</>
            }
          </button>
        )}
      </div>

      <div className="p-4 flex-1">
        {isEmpty ? (
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-zinc-700 border-t-[#1F4E79] rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-zinc-600">Generating…</p>
            </div>
          </div>
        ) : (
          <div>
            {!expanded
              ? <ContentPreview content={content} type={type} />
              : <ContentFull content={content} type={type} />
            }
            <button
              onClick={() => setExpanded(e => !e)}
              className="mt-3 flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {expanded
                ? <><ChevronUp className="w-3 h-3" /> Collapse</>
                : <><ChevronDown className="w-3 h-3" /> {isDoc ? 'View full document' : 'View all'}</>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
