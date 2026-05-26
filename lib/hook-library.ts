import type { HookFormat } from '../types'

export const HOOK_LIBRARY: HookFormat[] = [
  {
    id: 'problem_agitation',
    label: 'Problem → Agitation',
    description: 'Surface a pain point and amplify the frustration',
    structure: 'Are you {pain}? Here\'s why most people struggle...',
  },
  {
    id: 'did_you_know',
    label: 'Did You Know?',
    description: 'Lead with a surprising fact or stat',
    structure: 'Did you know {surprising_fact}? Here\'s what that means...',
  },
  {
    id: 'before_after',
    label: 'Before & After',
    description: 'Show the transformation your brand enables',
    structure: 'Before {brand}: {before_state}. After: {after_state}.',
  },
  {
    id: 'listicle',
    label: 'Top 3 List',
    description: 'Count-based hook that sets clear expectations',
    structure: '3 reasons {audience} can\'t stop talking about {product}:',
  },
  {
    id: 'pov',
    label: 'POV',
    description: 'Immersive first-person scenario',
    structure: 'POV: You just discovered {brand} and everything changed...',
  },
  {
    id: 'secret_reveal',
    label: 'Secret Reveal',
    description: 'Insider knowledge creates curiosity',
    structure: 'The {industry} secret that nobody talks about openly:',
  },
  {
    id: 'myth_bust',
    label: 'Myth Buster',
    description: 'Challenge a common misconception',
    structure: 'Stop believing {myth}. Here\'s the real truth:',
  },
  {
    id: 'hot_take',
    label: 'Hot Take',
    description: 'Controversial opinion drives engagement',
    structure: 'Unpopular opinion: {hot_take}. Here\'s why I\'m not changing my mind.',
  },
  {
    id: 'story_hook',
    label: 'Story / Anecdote',
    description: 'Relatable micro-story pulls viewers in',
    structure: 'I tried {product} for 30 days. Here\'s what happened:',
  },
  {
    id: 'question_hook',
    label: 'Direct Question',
    description: 'Asks what the viewer is already thinking',
    structure: 'What if you could {desired_outcome} without {obstacle}?',
  },
  {
    id: 'number_hook',
    label: 'Numbers Don\'t Lie',
    description: 'Lead with a compelling statistic',
    structure: '{number}% of {audience} don\'t know this yet.',
  },
  {
    id: 'authority_hook',
    label: 'Authority Lead',
    description: 'Establish expertise immediately',
    structure: 'After {experience} in {field}, here\'s the one thing that changes everything:',
  },
  {
    id: 'comparison_hook',
    label: 'Us vs. Them',
    description: 'Position brand against alternatives',
    structure: 'Why {audience} are leaving {alternative} for {brand}:',
  },
  {
    id: 'value_hook',
    label: 'Pure Value Lead',
    description: 'Start with the most useful insight',
    structure: 'The #1 thing that will transform your {goal}:',
  },
  {
    id: 'transformation_hook',
    label: 'Transformation Promise',
    description: 'Sell the outcome, not the product',
    structure: 'How to go from {current_state} to {desired_state} faster than you think:',
  },
  {
    id: 'fear_hook',
    label: 'Fear / Risk',
    description: 'Activates loss aversion',
    structure: 'If you\'re not doing {action}, you\'re leaving {opportunity} behind.',
  },
  {
    id: 'celebration_hook',
    label: 'Win / Milestone',
    description: 'Social proof through achievement',
    structure: 'We just {milestone}. Here\'s exactly how we did it:',
  },
  {
    id: 'tutorial_hook',
    label: 'How-To Lead',
    description: 'Educational content with a clear promise',
    structure: 'How to {outcome} in {timeframe} (step by step):',
  },
  {
    id: 'curiosity_hook',
    label: 'Open Loop',
    description: 'Creates curiosity gap they must close',
    structure: 'I wasn\'t going to share this, but {brand} changed everything for me...',
  },
  {
    id: 'relatability_hook',
    label: 'Relatability',
    description: 'Mirror the audience\'s exact experience',
    structure: 'If you\'ve ever {relatable_struggle}, this one\'s for you.',
  },
]

export function pickThreeHooks(excludeIds: string[] = []): HookFormat[] {
  const available = HOOK_LIBRARY.filter(h => !excludeIds.includes(h.id))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}
