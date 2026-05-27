'use client'

import { useState, useRef, useCallback } from 'react'
import { Download, Copy, CheckCheck, Clapperboard, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import type { ReelResult } from '@/types'
import { cn } from '@/lib/utils'

interface ReelCardProps {
  reel: ReelResult
  index: number
  brandName: string
  brand: { name: string; niche: string; tone: string }
}

// Load an image into a canvas-ready HTMLImageElement with CORS
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

// Ken Burns: smoothly pan+zoom across an image on canvas over `durationMs`
function renderKenBurns(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  progress: number, // 0→1
) {
  const scale = 1 + progress * 0.08           // zoom in slightly
  const dx = -progress * canvas.width * 0.03  // pan left
  const dy = -progress * canvas.height * 0.02 // pan up

  ctx.save()
  ctx.translate(canvas.width / 2 + dx, canvas.height / 2 + dy)
  ctx.scale(scale, scale)

  const imgAspect = img.naturalWidth / img.naturalHeight
  const canvasAspect = canvas.width / canvas.height
  let drawW: number, drawH: number
  if (imgAspect > canvasAspect) {
    drawH = canvas.height
    drawW = drawH * imgAspect
  } else {
    drawW = canvas.width
    drawH = drawW / imgAspect
  }

  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
  ctx.restore()
}

export function ReelCard({ reel, index, brandName, brand }: ReelCardProps) {
  const [captionTab, setCaptionTab] = useState<'instagram' | 'tiktok'>('instagram')
  const [copied, setCopied] = useState(false)
  const [activeClipIndex, setActiveClipIndex] = useState(0)
  const [videoUrls, setVideoUrls] = useState<string[]>(reel.videoUrls ?? [])
  const [mediaType, setMediaType] = useState<'video' | 'canvas' | null>(reel.videoUrls?.length ? 'video' : null)
  const [videoStatus, setVideoStatus] = useState<'idle' | 'loading' | 'recording' | 'done' | 'failed'>(
    reel.videoUrls?.length ? 'done' : 'idle'
  )
  const [progress, setProgress] = useState(0)
  const [canvasBlob, setCanvasBlob] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateVideo = useCallback(async () => {
    setVideoStatus('loading')
    setProgress(0)
    try {
      // 1. Get frames from API
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, hook: reel.script.hook, body: reel.script.body, duration: reel.totalDuration }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json() as {
        videoUrls?: string[]
        frames?: string[]
        type?: string
      }

      // Real Kling video
      if (data.type === 'video' && data.videoUrls?.length) {
        setVideoUrls(data.videoUrls)
        setMediaType('video')
        setVideoStatus('done')
        return
      }

      // Frames → canvas video
      const frameUrls = data.frames ?? []
      if (!frameUrls.length) throw new Error('No frames returned')

      setVideoStatus('recording')

      // 2. Load images
      const images = await Promise.all(frameUrls.map(loadImage))
      setProgress(20)

      // 3. Set up canvas
      const canvas = canvasRef.current!
      canvas.width = 576
      canvas.height = 1024
      const ctx = canvas.getContext('2d')!

      // 4. Record with MediaRecorder
      const stream = canvas.captureStream(30)
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm',
      })
      const chunks: Blob[] = []
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }

      recorder.start(100)

      // 5. Animate — 3 frames × ~3s each = ~9s total video
      const framesPerSeg = 90 // 30fps × 3s
      const totalFrames = images.length * framesPerSeg

      await new Promise<void>(resolve => {
        let frameIdx = 0
        let imgIdx = 0
        let segFrame = 0

        function tick() {
          if (frameIdx >= totalFrames) { recorder.stop(); resolve(); return }

          imgIdx = Math.floor(frameIdx / framesPerSeg)
          segFrame = frameIdx % framesPerSeg
          const segProgress = segFrame / framesPerSeg

          renderKenBurns(ctx, images[imgIdx], canvas, segProgress)

          // Cross-fade between scenes
          if (segFrame > framesPerSeg - 10 && imgIdx < images.length - 1) {
            const fadeAlpha = (segFrame - (framesPerSeg - 10)) / 10
            ctx.globalAlpha = fadeAlpha
            renderKenBurns(ctx, images[imgIdx + 1], canvas, 0)
            ctx.globalAlpha = 1
          }

          frameIdx++
          setProgress(20 + Math.round((frameIdx / totalFrames) * 75))
          requestAnimationFrame(tick)
        }

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' })
          const url = URL.createObjectURL(blob)
          setCanvasBlob(url)
          setMediaType('canvas')
          setVideoStatus('done')
          setProgress(100)
          resolve()
        }

        tick()
      })
    } catch (e) {
      console.error('[ReelCard] generate-video error:', e)
      setVideoStatus('failed')
    }
  }, [brand, reel, setVideoStatus, setProgress])

  const urls = videoUrls
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

  function handleDownloadCanvas() {
    if (!canvasBlob) return
    const a = document.createElement('a')
    a.href = canvasBlob
    a.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-reel${index}.webm`
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

      {/* Hidden canvas for recording */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video area */}
      <div className="aspect-[9/16] max-h-72 bg-gradient-to-b from-[#1F4E79] to-zinc-950 relative flex items-center justify-center overflow-hidden">
        {mediaType === 'canvas' && canvasBlob ? (
          <video
            src={canvasBlob}
            controls
            autoPlay
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : hasVideo ? (
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
          <div className="text-center text-white px-6 w-full">
            <p className="text-lg font-bold leading-snug mb-2">
              {reel.script.textOverlays.opening}
            </p>
            <p className="text-xs text-white/50 italic mb-4">{reel.script.hook}</p>

            {videoStatus === 'loading' && (
              <div>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-white/60 animate-pulse">Loading frames…</p>
              </div>
            )}
            {videoStatus === 'recording' && (
              <div>
                <div className="w-full bg-white/20 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className="bg-white h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-white/60 animate-pulse">Rendering video… {progress}%</p>
              </div>
            )}
            {videoStatus === 'failed' && (
              <div>
                <p className="text-xs text-red-300 mb-2">Generation failed</p>
                <button
                  onClick={generateVideo}
                  className="flex items-center gap-1.5 mx-auto bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Play className="w-3 h-3" /> Retry
                </button>
              </div>
            )}
            {videoStatus === 'idle' && (
              <button
                onClick={generateVideo}
                className="flex items-center gap-1.5 mx-auto bg-[#1F4E79] hover:bg-[#2d6da3] text-white text-xs px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Play className="w-3.5 h-3.5" /> Generate Video
              </button>
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
        {mediaType === 'canvas' && canvasBlob ? (
          <button
            onClick={handleDownloadCanvas}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-green-700 text-white hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4" /> Download WebM
          </button>
        ) : hasVideo && totalClips > 1 ? (
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
              {videoStatus === 'loading' || videoStatus === 'recording' ? 'Generating…' : 'Click Generate Video above'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
