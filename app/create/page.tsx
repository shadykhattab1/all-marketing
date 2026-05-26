'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BrandInputPanel, type BrandInputData } from '@/components/BrandInputPanel'
import { GenerationProgress } from '@/components/GenerationProgress'
import type { BrandProfile, GenerationStep } from '@/types'

// ─── Constants ────────────────────────────────────────────────────────────────

type FlowStep = 'input' | 'brand-review' | 'generating' | 'done'

const GENERATION_STEPS: GenerationStep[] = [
  { id: 'brand', label: 'Analyzing brand...', status: 'waiting' },
  { id: 'content', label: 'Generating content (13 types)...', status: 'waiting' },
  { id: 'reels', label: 'Creating video reels...', status: 'waiting' },
  { id: 'saving', label: 'Saving campaign...', status: 'waiting' },
]

const TONE_LABELS: Record<string, string> = {
  professional: 'Professional',
  casual: 'Casual & Friendly',
  playful: 'Playful & Fun',
  luxurious: 'Luxurious',
  educational: 'Educational',
}

function makeDefaultInput(searchParams: URLSearchParams): BrandInputData {
  const url = searchParams.get('url') ?? ''
  const mode = searchParams.get('mode')
  const activeTab = mode === 'photo' ? 'photo' : mode === 'manual' ? 'manual' : mode === 'social' ? 'social' : 'url'

  return {
    activeTab,
    url,
    socialUrl: '',
    brandName: '',
    brandNiche: '',
    brandTone: 'professional',
    brandAudience: '',
  }
}

function getSessionId(): string {
  if (typeof window === 'undefined') return crypto.randomUUID()
  const stored = localStorage.getItem('all_marketing_session_id')
  if (stored) return stored
  const id = crypto.randomUUID()
  localStorage.setItem('all_marketing_session_id', id)
  return id
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function CreatePageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [input, setInput] = useState<BrandInputData>(() => makeDefaultInput(searchParams))
  const [step, setStep] = useState<FlowStep>('input')
  const [brand, setBrand] = useState<BrandProfile | null>(null)
  const [steps, setSteps] = useState<GenerationStep[]>(GENERATION_STEPS)
  const [error, setError] = useState<string | null>(null)

  // Re-init input when search params change (e.g. navigating to ?url=...)
  useEffect(() => {
    setInput(makeDefaultInput(searchParams))
  }, [searchParams])

  function setStepStatus(id: string, status: GenerationStep['status']) {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }

  async function handleGenerate() {
    if (!brand) return
    setError(null)
    setStep('generating')

    const sessionId = getSessionId()

    // Reset step states
    setSteps(GENERATION_STEPS.map(s => ({ ...s, status: 'waiting' })))

    try {
      // Step 1: brand (already done — mark complete immediately)
      setStepStatus('brand', 'complete')

      // Step 2 & 3: create campaign shell, then run both generators in parallel
      setStepStatus('content', 'active')
      setStepStatus('reels', 'active')

      // Create empty campaign
      const createRes = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, brand }),
      })

      if (!createRes.ok) throw new Error('Failed to create campaign')
      const { campaign } = await createRes.json()
      const campaignId: string = campaign.id

      // Fire both generators in parallel — PATCH campaign as results arrive
      const [contentResult, reelsResult] = await Promise.allSettled([
        fetch('/api/generate-campaign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, brand, campaignId }),
        }).then(async (r) => {
          if (!r.ok) throw new Error('Content generation failed')
          const data = await r.json()
          setStepStatus('content', 'complete')
          return data
        }),
        fetch('/api/generate-reels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            brand,
            campaignId,
            count: 3,
            reelIdea: input.reelIdea?.trim() || undefined,
          }),
        }).then(async (r) => {
          if (!r.ok) throw new Error('Reel generation failed')
          const data = await r.json()
          setStepStatus('reels', 'complete')
          return data
        }),
      ])

      // Mark any failures without blocking
      if (contentResult.status === 'rejected') setStepStatus('content', 'error')
      if (reelsResult.status === 'rejected') setStepStatus('reels', 'error')

      // Step 4: finalize campaign
      setStepStatus('saving', 'active')

      await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'complete' }),
      })

      setStepStatus('saving', 'complete')
      setStep('done')
      router.push(`/campaign/${campaignId}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed')
      setStep('brand-review')
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-300 border border-violet-500/20 px-4 py-1.5 rounded-full text-xs font-medium mb-4">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            All Marketing · Campaign Wizard
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            {step === 'input' && 'Create your campaign'}
            {step === 'brand-review' && 'Review your brand'}
            {step === 'generating' && 'Generating campaign...'}
            {step === 'done' && 'Campaign ready'}
          </h1>
          {step === 'input' && (
            <p className="text-white/50 text-lg">
              Enter your brand — we'll generate 13 content types + 3 video reels.
            </p>
          )}
        </div>

        {/* Input state */}
        {step === 'input' && (
          <BrandInputPanel
            value={input}
            onChange={setInput}
            onExtract={(extractedBrand) => {
              setBrand(extractedBrand)
              setStep('brand-review')
            }}
          />
        )}

        {/* Brand review state */}
        {step === 'brand-review' && brand && (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Brand extracted</h3>
                  <p className="text-xs text-white/40">from {brand.extractedFrom}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-white/40 uppercase tracking-wide font-medium mb-1">Brand</p>
                  <p className="text-sm font-semibold text-white">{brand.name}</p>
                  {brand.tagline && (
                    <p className="text-xs text-white/40 mt-0.5 italic">"{brand.tagline}"</p>
                  )}
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-white/40 uppercase tracking-wide font-medium mb-1">Niche</p>
                  <p className="text-sm font-semibold text-white capitalize">{brand.niche}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-white/40 uppercase tracking-wide font-medium mb-1">Tone</p>
                  <p className="text-sm font-semibold text-white">{TONE_LABELS[brand.tone] ?? brand.tone}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-white/40 uppercase tracking-wide font-medium mb-1">Audience</p>
                  <p className="text-sm text-white/80 line-clamp-2">{brand.targetAudience}</p>
                </div>
              </div>

              {brand.keyMessages.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wide font-medium mb-2">Key Messages</p>
                  <ul className="space-y-1">
                    {brand.keyMessages.slice(0, 3).map((m, i) => (
                      <li key={i} className="text-xs text-white/60 flex gap-2">
                        <span className="text-violet-400 flex-shrink-0">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setStep('input'); setBrand(null); setError(null) }}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 font-medium hover:bg-white/5 hover:text-white transition-colors text-sm"
              >
                ← Edit
              </button>
              <button
                onClick={handleGenerate}
                className="flex-[2] py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-900/40"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Looks right? Generate →
              </button>
            </div>
          </div>
        )}

        {/* Generating state */}
        {step === 'generating' && (
          <div className="space-y-4">
            <GenerationProgress steps={steps} title="Building your campaign..." />
            <p className="text-center text-xs text-white/30 mt-2">
              This takes 30–60 seconds. You can watch the progress live.
            </p>
          </div>
        )}

        {/* Done state (brief — router.push fires immediately after) */}
        {step === 'done' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white font-semibold">Campaign ready</p>
            <p className="text-white/40 text-sm mt-1">Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    }>
      <CreatePageInner />
    </Suspense>
  )
}
