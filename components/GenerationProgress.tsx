'use client'

import { CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react'
import type { GenerationStep } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  steps: GenerationStep[]
  title?: string
}

export function GenerationProgress({ steps, title = 'Building your campaign...' }: Props) {
  const completeCount = steps.filter(s => s.status === 'complete').length
  const progress = steps.length > 0 ? (completeCount / steps.length) * 100 : 0

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <span className="text-xs text-white/40">{completeCount}/{steps.length}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {step.status === 'complete' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {step.status === 'active' && <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />}
              {step.status === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
              {step.status === 'waiting' && <Circle className="w-5 h-5 text-white/20" />}
            </div>
            <div className="flex-1">
              <p className={cn(
                'text-sm font-medium',
                step.status === 'complete' ? 'text-emerald-400' :
                step.status === 'active' ? 'text-white' :
                step.status === 'error' ? 'text-red-400' :
                'text-white/30'
              )}>
                {step.label}
              </p>
            </div>
            {step.status === 'active' && (
              <div className="flex-shrink-0">
                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-400 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            )}
            {step.status === 'complete' && (
              <span className="flex-shrink-0 text-xs text-emerald-400/60">Done</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
