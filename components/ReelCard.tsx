'use client'

import { useState, useRef } from 'react'
import { Download, Copy, CheckCheck, Clapperboard, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReelResult } from '@/types'
import { cn } from '@/lib/utils'

interface ReelCardProps {
  reel: ReelResult
  index: number
  brandName: string
}

export function ReelCard({ reel, index, brandName }: ReelCardProps) {
  const [captionTab, setCaptionTab] = useState<'instagram' | 'tiktok'>('instagram')
  const [copied, setCopied] = useState(false)
  const [activeClipIndex, setActiveClipIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const urls = reel.videoUrls ?? []
  const totalClips = urls.length
  const hasVideo = totalClips > 0

  const allHashtags = [
    ...reel.script.hashtags.branded,
    ...reel.script.hashtags.niche,
    ...reel.script.hashtags.broad,
  ]

  function handleClipEnded() {
    if (activeClipIndex < totalClips - 1) {
      setActiveClipIndex(i => i + 1)
      setTimeout(() => videoRef.current?.play(), 50)
    }
  }

  function handleDownloadClip(url: string, clipIdx: number) {
    const a = document.createElement('a')
    a.href = url
    a.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-reel${index}${totalClips > 1 ? `-part${clipIdx + 1}` : ''}.mp4`
    a.target = '_blank'
    a.click()
  }

  function copyCaption() {
    const caption = captionTab === 'instagram'
      ? reel.script.caption.instagram
      : reel.script.caption.tiktok
    navigator.clipboard.writeText(caption + '\n\n' + allHashtags.join(' '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-[#1F4E79] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clapperboard className="w-4 h-4 text-white/80" />
          <span className="text-sm font-semibold text-white">Reel {index}</span>
        </div>
        <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
          {reel.script.hookFormatLabel}
        </span>
      </div>

      {/* Video area */}
      <div className="aspect-[9/16] max-h-72 bg-gradient-to-b from-[#1F4E79] to-zinc-950 relative flex items-center justify-center overflow-hidden">
        {hasVideo ? (
          <>
            <video
              ref={videoRef}
              key={urls[activeClipIndex]}
              src={urls[activeClipIndex]}
              controls
              playsInline
              onEnded={handleClipEnded}
              className="w-full h-full object-cover"
            />
            {totalClips > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2">
                <button
                  onClick={() => setActiveClipIndex(i => Math.max(0, i - 1))}
                  disabled={activeClipIndex === 0}
                  className="bg-black/50 text-white rounded-full p-1 disabled:opacity-30 hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="bg-black/60 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {activeClipIndex + 1} / {totalClips} · {reel.totalDuration}s total
                </span>
                <button
                  onClick={() => setActiveClipIndex(i => Math.min(totalClips - 1, i + 1))}
                  disabled={activeClipIndex === totalClips - 1}
                  className="bg-black/50 text-white rounded-full p-1 disabled:opacity-30 hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-white px-6">
            <p className="text-lg font-bold leading-snug mb-2">
              {reel.script.textOverlays.opening}
            </p>
            <p className="text-xs text-white/50 italic">{reel.script.hook}</p>
            {reel.status === 'generating' && (
              <p className="text-xs text-white/60 mt-3 animate-pulse">Generating video…</p>
            )}
            {reel.status === 'failed' && (
              <p className="text-xs text-red-300 mt-3">Generation failed</p>
            )}
          </div>
        )}
      </div>

      {/* Hook */}
      <div className="px-4 py-3 border-b border-zinc-800">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Hook</p>
        <p className="text-sm font-semibold text-white">"{reel.script.hook}"</p>
      </div>

      {/* Body bullets */}
      <div className="px-4 py-3 border-b border-zinc-800">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Body</p>
        <ul className="space-y-1">
          {reel.script.body.map((line, i) => (
            <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
              <span className="text-[#2d6da3] shrink-0 mt-0.5">·</span>
              {line}
            </li>
          ))}
        </ul>
      </div>

      {/* Caption tabs */}
      <div className="px-4 pt-3">
        <div className="flex gap-2 mb-2">
          {(['instagram', 'tiktok'] as const).map(platform => (
            <button
              key={platform}
              onClick={() => setCaptionTab(platform)}
              className={cn(
                'text-xs font-medium px-3 py-1 rounded-full border transition-colors',
                captionTab === platform
                  ? 'bg-[#1F4E79] text-white border-[#1F4E79]'
                  : 'text-zinc-400 border-zinc-700 hover:border-[#1F4E79] hover:text-white',
              )}
            >
              {platform === 'instagram' ? '📸 Instagram' : '🎵 TikTok'}
            </button>
          ))}
          <button
            onClick={copyCaption}
            className="ml-auto flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors"
          >
            {copied
              ? <><CheckCheck className="w-3.5 h-3.5 text-green-400" /> Copied!</>
              : <><Copy className="w-3.5 h-3.5" /> Copy</>
            }
          </button>
        </div>
        <div className="text-xs text-zinc-300 line-clamp-3 leading-relaxed bg-zinc-800/50 rounded-lg p-2.5">
          {captionTab === 'instagram' ? reel.script.caption.instagram : reel.script.caption.tiktok}
        </div>
      </div>

      {/* Hashtag summary */}
      <div className="px-4 py-2">
        <p className="text-xs text-zinc-600">
          <span className="font-medium text-[#2d6da3]">{allHashtags.length}</span> hashtags ·{' '}
          {reel.script.hashtags.branded.length} branded ·{' '}
          {reel.script.hashtags.niche.length} niche ·{' '}
          {reel.script.hashtags.broad.length} broad
        </p>
      </div>

      {/* Download */}
      <div className="p-4 mt-auto border-t border-zinc-800 space-y-2">
        {hasVideo && totalClips > 1 ? (
          <div className="space-y-1.5">
            <p className="text-xs text-zinc-500 font-medium">{totalClips} clips · {reel.totalDuration}s total</p>
            <div className="flex gap-1.5 flex-wrap">
              {urls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => handleDownloadClip(url, i)}
                  className="flex items-center gap-1.5 bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Part {i + 1}
                </button>
              ))}
            </div>
          </div>
        ) : hasVideo ? (
          <button
            onClick={() => handleDownloadClip(urls[0], 0)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-green-700 text-white hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4" /> Download MP4
          </button>
        ) : (
          <div className="text-center py-1">
            <p className="text-xs text-zinc-600">
              {reel.status === 'pending' ? 'Video pending generation' : reel.status === 'generating' ? 'Generating…' : 'No video available'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
