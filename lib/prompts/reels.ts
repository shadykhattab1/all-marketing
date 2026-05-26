import type { BrandProfile, HookFormat } from '../../types'

export const SCRIPT_SYSTEM_PROMPT = `You are a viral social media content creator specializing in Instagram Reels and TikTok. Generate scripts that are authentic to the brand's tone, scroll-stopping, and optimized for short-form video. Return ONLY valid JSON — no markdown, no explanation.`

export const HASHTAG_FORMULA = `
Generate hashtags in exactly this structure:
- branded: 2-3 brand-specific hashtags (#BrandName, #BrandNameOfficial, etc.)
- niche: 15-20 highly targeted hashtags with under 500K posts
- broad: 10 popular hashtags with 1M+ posts relevant to the industry
`

export function buildScriptPrompt(brand: BrandProfile, hook: HookFormat, reelIdea?: string): string {
  const ideaBlock = reelIdea
    ? `\nCREATOR'S REEL IDEA (use this as the primary creative brief — build the hook, body, and CTA around this):\n"${reelIdea}"\n`
    : ''

  return `You are a viral social media content creator specializing in Instagram Reels and TikTok.

BRAND PROFILE:
- Name: ${brand.name}
- Niche: ${brand.niche}
- Tone: ${brand.tone}
- Target Audience: ${brand.targetAudience}
- Products/Services: ${brand.products.join(', ')}
- Key Messages: ${brand.keyMessages.join(', ')}
${ideaBlock}

HOOK FORMAT TO USE: ${hook.label}
Hook Description: ${hook.description}
Hook Structure: ${hook.structure}

Generate a complete reel script using the "${hook.label}" hook format. The content must feel authentic to the brand's ${brand.tone} tone.

Return ONLY this JSON structure (no markdown, no explanation):
{
  "hookFormatId": "${hook.id}",
  "hookFormatLabel": "${hook.label}",
  "hook": "<scroll-stopping opening line, MAX 8 words, ultra-punchy>",
  "body": ["<point 1>", "<point 2>", "<point 3>"],
  "cta": "<clear call to action, 5-10 words>",
  "voiceover": "<full 15-25 second narration script that flows naturally when read aloud>",
  "caption": {
    "instagram": "<150-200 word IG caption with relevant emojis, line breaks, and storytelling>",
    "tiktok": "<60-80 word TikTok caption, punchy, trend-aware, includes a question or challenge>"
  },
  "hashtags": {
    "branded": ["#${brand.name.replace(/\s+/g, '')}", "..."],
    "niche": ["<15-20 niche hashtags>"],
    "broad": ["<10 broad hashtags>"]
  },
  "textOverlays": {
    "opening": "<large hook text for video overlay, MAX 6 words>",
    "bullets": ["<slide 1 text>", "<slide 2 text>", "<slide 3 text>"],
    "closing": "<CTA text for final slide>"
  }
}

${HASHTAG_FORMULA}

IMPORTANT:
- Hook must be ${brand.tone} in tone, NOT generic
- All content must be specific to ${brand.name} and their audience (${brand.targetAudience})
- Voiceover should read naturally in 15-25 seconds (roughly 60-100 words)
- textOverlays.bullets should be SHORT punchy phrases (3-6 words each) for the video slides`
}
