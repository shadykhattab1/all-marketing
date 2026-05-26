'use client'

import { useState } from 'react'
import { Copy, CheckCheck, ChevronDown, ChevronUp } from 'lucide-react'
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
}

function formatForCopy(content: unknown): string {
  if (typeof content === 'string') return content
  return JSON.stringify(content, null, 2)
}

function ContentPreview({ content, type }: { content: unknown; type: ContentType }) {
  if (content === null || content === undefined) return null

  // Type-specific rendering
  if (type === 'seo' && typeof content === 'object') {
    const seo = content as Record<string, unknown>
    return (
      <div className="space-y-3">
        {!!seo.metaTitle && (
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Meta Title</p>
            <p className="text-sm text-white font-medium">{String(seo.metaTitle)}</p>
          </div>
        )}
        {!!seo.metaDescription && (
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Meta Description</p>
            <p className="text-xs text-zinc-300 leading-relaxed">{String(seo.metaDescription)}</p>
          </div>
        )}
        {Array.isArray(seo.primaryKeywords) && (
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Primary Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {(seo.primaryKeywords as string[]).slice(0, 8).map((kw, i) => (
                <span key={i} className="bg-[#1F4E79]/30 border border-[#1F4E79]/50 text-blue-300 text-xs px-2 py-0.5 rounded-full">{kw}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (type === 'blog' && typeof content === 'object') {
    const blog = content as Record<string, unknown>
    return (
      <div className="space-y-2">
        {!!blog.title && <p className="text-sm font-semibold text-white">{String(blog.title)}</p>}
        {!!blog.metaDescription && <p className="text-xs text-zinc-400 leading-relaxed">{String(blog.metaDescription)}</p>}
        {!!blog.targetKeyword && (
          <span className="inline-block bg-[#1F4E79]/30 border border-[#1F4E79]/50 text-blue-300 text-xs px-2 py-0.5 rounded-full">
            {String(blog.targetKeyword)}
          </span>
        )}
        {!!blog.wordCount && <p className="text-xs text-zinc-600">~{String(blog.wordCount)} words</p>}
      </div>
    )
  }

  if (type === 'ads' && typeof content === 'object') {
    const ads = content as Record<string, unknown>
    const googleAds = Array.isArray(ads.googleAds) ? ads.googleAds : []
    const first = googleAds[0] as Record<string, unknown> | undefined
    return (
      <div className="space-y-2">
        {(first != null && Array.isArray(first.headlines)) && (
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Sample Google Ad</p>
            {(first.headlines as string[]).slice(0, 2).map((h, i) => (
              <p key={i} className="text-blue-400 text-sm font-medium">{h}</p>
            ))}
          </div>
        )}
        {!!ads.targetAudience && (
          <p className="text-xs text-zinc-400">{String(ads.targetAudience)}</p>
        )}
      </div>
    )
  }

  if (type === 'email' && typeof content === 'object') {
    const seq = content as Record<string, unknown>
    return (
      <div className="space-y-2">
        {!!seq.sequenceName && <p className="text-sm font-semibold text-white">{String(seq.sequenceName)}</p>}
        {!!seq.goal && <p className="text-xs text-zinc-400">{String(seq.goal)}</p>}
        {Array.isArray(seq.emails) && (
          <p className="text-xs text-zinc-600">{seq.emails.length} emails in sequence</p>
        )}
      </div>
    )
  }

  if (type === 'social' && typeof content === 'object') {
    const social = content as Record<string, unknown>
    const ig = social.instagram as Record<string, unknown> | undefined
    return (
      <div className="space-y-2">
        {!!(ig?.postText) && (
          <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">{String(ig!.postText)}</p>
        )}
        {!!(ig?.characterCount) && (
          <p className="text-xs text-zinc-600">~{String(ig!.characterCount)} characters · Instagram</p>
        )}
      </div>
    )
  }

  if (type === 'brand-kit' && typeof content === 'object') {
    const kit = content as Record<string, unknown>
    const colors = Array.isArray(kit.colors) ? kit.colors as Array<Record<string, string>> : []
    return (
      <div className="space-y-3">
        {colors.length > 0 && (
          <div className="flex gap-2">
            {colors.slice(0, 5).map((c, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-8 h-8 rounded-lg border border-zinc-700"
                  style={{ backgroundColor: c.hex }}
                />
                <p className="text-[10px] text-zinc-600 font-mono mt-0.5">{c.hex}</p>
              </div>
            ))}
          </div>
        )}
        {!!kit.primaryFont && (
          <p className="text-xs text-zinc-400">
            <span className="text-zinc-500">Fonts:</span> {String(kit.primaryFont)} + {String(kit.secondaryFont ?? '')}
          </p>
        )}
      </div>
    )
  }

  if (type === 'website-copy' && typeof content === 'object') {
    const copy = content as Record<string, unknown>
    return (
      <div className="space-y-2">
        {!!copy.heroHeadline && (
          <p className="text-sm font-bold text-white leading-snug">{String(copy.heroHeadline)}</p>
        )}
        {!!copy.tagline && (
          <p className="text-xs text-[#2d6da3] italic">{String(copy.tagline)}</p>
        )}
        {!!copy.ctaText && (
          <span className="inline-block bg-[#1F4E79] text-white text-xs px-3 py-1 rounded-lg">{String(copy.ctaText)}</span>
        )}
      </div>
    )
  }

  if (type === 'calendar' && typeof content === 'object') {
    const cal = content as Record<string, unknown>
    const entries = Array.isArray(cal.entries) ? cal.entries : []
    return (
      <div className="space-y-2">
        {!!cal.month && <p className="text-sm font-semibold text-white">{String(cal.month)}</p>}
        {!!cal.theme && <p className="text-xs text-zinc-400">Theme: {String(cal.theme)}</p>}
        <p className="text-xs text-zinc-600">{entries.length} content entries planned</p>
      </div>
    )
  }

  if (type === 'competitors' && typeof content === 'object') {
    const analysis = content as Record<string, unknown>
    const competitors = Array.isArray(analysis.competitors) ? analysis.competitors as Array<Record<string, unknown>> : []
    return (
      <div className="space-y-2">
        {competitors.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {competitors.map((c, i) => (
              <span key={i} className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-2 py-0.5 rounded">
                {String(c.name ?? '')}
              </span>
            ))}
          </div>
        )}
        {Array.isArray(analysis.positioningGaps) && (
          <p className="text-xs text-zinc-400">{(analysis.positioningGaps as string[]).length} positioning gaps identified</p>
        )}
      </div>
    )
  }

  if (type === 'aeo' && typeof content === 'object') {
    const aeo = content as Record<string, unknown>
    const qas = Array.isArray(aeo.questionsAndAnswers) ? aeo.questionsAndAnswers as Array<Record<string, string>> : []
    return (
      <div className="space-y-2">
        {qas.slice(0, 2).map((qa, i) => (
          <div key={i}>
            <p className="text-xs font-medium text-zinc-300">{qa.question}</p>
            <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{qa.answer}</p>
          </div>
        ))}
        {qas.length > 2 && <p className="text-xs text-zinc-600">+{qas.length - 2} more Q&As</p>}
      </div>
    )
  }

  // Fallback: raw JSON preview
  return (
    <pre className="text-xs text-zinc-400 leading-relaxed overflow-hidden line-clamp-4 whitespace-pre-wrap font-mono">
      {JSON.stringify(content, null, 2)}
    </pre>
  )
}

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

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-base">{TYPE_ICONS[type]}</span>
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        <div className="flex items-center gap-2">
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
      </div>

      {/* Content */}
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
            <div className={cn(!expanded && 'max-h-40 overflow-hidden')}>
              <ContentPreview content={content} type={type} />
            </div>
            {/* Expand toggle */}
            <button
              onClick={() => setExpanded(e => !e)}
              className="mt-3 flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {expanded
                ? <><ChevronUp className="w-3 h-3" /> Collapse</>
                : <><ChevronDown className="w-3 h-3" /> Expand full JSON</>
              }
            </button>
            {expanded && (
              <pre className="mt-3 text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono bg-zinc-800/50 rounded-lg p-3 max-h-96 overflow-y-auto">
                {JSON.stringify(content, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
