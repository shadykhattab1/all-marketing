'use client'

import { useState, useRef } from 'react'
import { Upload, Globe, User, AtSign } from 'lucide-react'
import type { BrandProfile, Tone } from '@/types'
import { cn } from '@/lib/utils'

export interface BrandInputData {
  activeTab: 'photo' | 'url' | 'manual' | 'social'
  imageBase64?: string
  imagePreviewUrl?: string
  reelIdea?: string
  url: string
  socialUrl: string
  brandName: string
  brandNiche: string
  brandTone: Tone
  brandAudience: string
}

interface Props {
  value: BrandInputData
  onChange: (data: BrandInputData) => void
  onExtract: (brand: BrandProfile) => void
}

const TABS = [
  { id: 'url', label: 'Website URL', icon: Globe },
  { id: 'photo', label: 'Photo Upload', icon: Upload },
  { id: 'social', label: 'Social Link', icon: AtSign },
  { id: 'manual', label: 'Brand Profile', icon: User },
] as const

const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual & Friendly' },
  { value: 'playful', label: 'Playful & Fun' },
  { value: 'luxurious', label: 'Luxurious' },
  { value: 'educational', label: 'Educational' },
]

export function BrandInputPanel({ value, onChange, onExtract }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(patch: Partial<BrandInputData>) {
    onChange({ ...value, ...patch })
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      const base64 = dataUrl.split(',')[1]
      update({ activeTab: 'photo', imageBase64: base64, imagePreviewUrl: dataUrl })
    }
    reader.readAsDataURL(file)
  }

  function hasInput(): boolean {
    return !!(
      value.imageBase64 ||
      value.url.trim() ||
      value.socialUrl.trim() ||
      value.brandName.trim()
    )
  }

  async function handleExtract() {
    if (!hasInput() || extracting) return
    setError(null)
    setExtracting(true)

    try {
      const body: Record<string, unknown> = {}
      if (value.activeTab === 'photo' && value.imageBase64) {
        body.imageBase64 = value.imageBase64
        if (value.reelIdea?.trim()) body.reelIdea = value.reelIdea.trim()
      } else if (value.activeTab === 'url' && value.url) {
        body.url = value.url
      } else if (value.activeTab === 'social' && value.socialUrl) {
        body.socialUrl = value.socialUrl
      } else if (value.activeTab === 'manual') {
        body.brandName = value.brandName
        body.brandNiche = value.brandNiche
        body.brandTone = value.brandTone
        body.brandAudience = value.brandAudience
      }

      const res = await fetch('/api/analyze-brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Brand analysis failed')
      }

      const { brand } = await res.json()
      onExtract(brand)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setExtracting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-white/5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => update({ activeTab: id })}
              className={cn(
                'flex-1 flex flex-col items-center gap-1.5 py-3 px-2 text-xs font-medium transition-colors',
                value.activeTab === id
                  ? 'bg-white/10 text-white border-b-2 border-violet-400'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {value.activeTab === 'photo' && (
            <div className="space-y-4">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              {value.imagePreviewUrl ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={value.imagePreviewUrl}
                    alt="Brand photo"
                    className="w-full h-48 object-cover rounded-lg border border-white/10"
                  />
                  <button
                    onClick={() => update({ imageBase64: undefined, imagePreviewUrl: undefined })}
                    className="absolute top-2 right-2 bg-black/60 text-red-400 rounded-full p-1 hover:bg-black/80 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragOver(false)
                    e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0])
                  }}
                  className={cn(
                    'border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors',
                    dragOver
                      ? 'border-violet-400 bg-violet-500/10'
                      : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                  )}
                >
                  <Upload className="w-10 h-10 mx-auto text-white/30 mb-3" />
                  <p className="text-sm font-medium text-white/70">Drop your brand photo here</p>
                  <p className="text-xs text-white/40 mt-1">or click to browse · PNG, JPG, WEBP</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wide mb-1.5">
                  Campaign Idea <span className="text-white/30 normal-case font-normal">(optional)</span>
                </label>
                <textarea
                  value={value.reelIdea ?? ''}
                  onChange={(e) => update({ reelIdea: e.target.value })}
                  placeholder="Describe what you want to promote — e.g. 'Launching a summer sale on fitness gear, want to highlight the discount and urgency'"
                  rows={3}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {value.activeTab === 'url' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white/70">Website URL</label>
              <input
                type="url"
                value={value.url}
                onChange={(e) => update({ url: e.target.value })}
                placeholder="https://yourbrand.com"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
              <p className="text-xs text-white/40">We'll extract your brand voice, products, and key messages automatically.</p>
            </div>
          )}

          {value.activeTab === 'manual' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wide mb-1.5">Brand Name *</label>
                  <input
                    type="text"
                    value={value.brandName}
                    onChange={(e) => update({ brandName: e.target.value })}
                    placeholder="Acme Fitness"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wide mb-1.5">Niche</label>
                  <input
                    type="text"
                    value={value.brandNiche}
                    onChange={(e) => update({ brandNiche: e.target.value })}
                    placeholder="fitness coaching"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wide mb-1.5">Brand Tone</label>
                <div className="flex gap-2 flex-wrap">
                  {TONE_OPTIONS.map(({ value: v, label }) => (
                    <button
                      key={v}
                      onClick={() => update({ brandTone: v })}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                        value.brandTone === v
                          ? 'bg-violet-600 text-white border-violet-600'
                          : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white/80'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wide mb-1.5">Target Audience</label>
                <input
                  type="text"
                  value={value.brandAudience}
                  onChange={(e) => update({ brandAudience: e.target.value })}
                  placeholder="Women 25-40 interested in health and wellness"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {value.activeTab === 'social' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white/70">Instagram or TikTok Profile URL</label>
              <input
                type="url"
                value={value.socialUrl}
                onChange={(e) => update({ socialUrl: e.target.value })}
                placeholder="https://instagram.com/yourbrand"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
              <p className="text-xs text-white/40">We'll analyze your existing content to match your brand's style and tone.</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleExtract}
        disabled={!hasInput() || extracting}
        className={cn(
          'w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2.5 transition-all',
          hasInput() && !extracting
            ? 'bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-900/40'
            : 'bg-white/10 text-white/30 cursor-not-allowed'
        )}
      >
        {extracting ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing your brand...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Analyze Brand
          </>
        )}
      </button>
    </div>
  )
}
