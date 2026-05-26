<!-- ijfw schema:1 codebase-index -->
# Codebase index

Generated: 2026-05-26T14:22:57Z
Root: .

Files: 40

## By file

- `./app/api/analyze-brand/route.ts` (43 lines, .ts) -- import { NextResponse } from 'next/server'
- `./app/api/campaigns/[id]/route.ts` (79 lines, .ts) -- import { NextResponse } from 'next/server'
- `./app/api/campaigns/[id]/share/route.ts` (30 lines, .ts) -- import { NextResponse } from 'next/server'
- `./app/api/campaigns/route.ts` (54 lines, .ts) -- import { NextResponse } from 'next/server'
- `./app/api/generate-campaign/route.ts` (214 lines, .ts) -- import { NextResponse } from 'next/server'
- `./app/api/generate-reels/route.ts` (219 lines, .ts) -- import { NextRequest, NextResponse } from 'next/server'
- `./app/campaign/[id]/page.tsx` (35 lines, .tsx) -- import { notFound } from 'next/navigation'
- `./app/create/page.tsx` (310 lines, .tsx) -- 'use client'
- `./app/layout.tsx` (51 lines, .tsx) -- import type { Metadata } from \"next\";
- `./app/page.tsx` (363 lines, .tsx) -- 'use client';
- `./components/BrandInputPanel.tsx` (322 lines, .tsx) -- 'use client'
- `./components/CampaignDashboard.tsx` (351 lines, .tsx) -- 'use client'
- `./components/ContentCard.tsx` (313 lines, .tsx) -- 'use client'
- `./components/GenerationProgress.tsx` (66 lines, .tsx) -- 'use client'
- `./components/ReelCard.tsx` (214 lines, .tsx) -- 'use client'
- `./lib/brand-extractor.ts` (130 lines, .ts) -- import Anthropic from '@anthropic-ai/sdk'
- `./lib/claude.ts` (52 lines, .ts) -- import Anthropic from \"@anthropic-ai/sdk\";
- `./lib/dalle.ts` (21 lines, .ts) -- import OpenAI from \"openai\";
- `./lib/db.ts` (15 lines, .ts) -- import { PrismaClient } from \"./generated/prisma/client\";
- `./lib/email.ts` (24 lines, .ts) -- import { Resend } from \"resend\";
- `./lib/fal.ts` (8 lines, .ts) -- import { fal } from \"@fal-ai/client\";
- `./lib/generated/prisma/browser.ts` (24 lines, .ts) -- import * as Prisma from './internal/prismaNamespaceBrowser'
- `./lib/generated/prisma/client.ts` (48 lines, .ts) -- import * as process from 'node:process'
- `./lib/generated/prisma/commonInputTypes.ts` (372 lines, .ts) -- import type * as runtime from \"@prisma/client/runtime/client\"
- `./lib/generated/prisma/enums.ts` (15 lines, .ts) -- export {}
- `./lib/generated/prisma/internal/class.ts` (204 lines, .ts) -- import * as runtime from \"@prisma/client/runtime/client\"
- `./lib/generated/prisma/internal/prismaNamespace.ts` (818 lines, .ts) -- import * as runtime from \"@prisma/client/runtime/client\"
- `./lib/generated/prisma/internal/prismaNamespaceBrowser.ts` (135 lines, .ts) -- import * as runtime from \"@prisma/client/runtime/index-browser\"
- `./lib/generated/prisma/models.ts` (11 lines, .ts) -- export type * from './models/Campaign'
- `./lib/generated/prisma/models/Campaign.ts` (1283 lines, .ts) -- import type * as runtime from \"@prisma/client/runtime/client\"
- `./lib/hook-library.ts` (130 lines, .ts) -- import type { HookFormat } from '../types'
- `./lib/prompts/campaign.ts` (413 lines, .ts) -- import type { BrandProfile, BusinessProfile, SeoData, CompetitorAnalysis } from '../../types'
- `./lib/prompts/reels.ts` (65 lines, .ts) -- import type { BrandProfile, HookFormat } from '../../types'
- `./lib/script-generator.ts` (98 lines, .ts) -- import Anthropic from '@anthropic-ai/sdk'
- `./lib/utils.ts` (25 lines, .ts) -- import { type ClassValue, clsx } from \"clsx\";
- `./next-env.d.ts` (6 lines, .ts) -- import \"./.next/types/routes.d.ts\";
- `./next.config.ts` (27 lines, .ts) -- import type { NextConfig } from \"next\";
- `./prisma.config.ts` (12 lines, .ts) -- import \"dotenv/config\";
- `./tailwind.config.ts` (12 lines, .ts) -- import type { Config } from \"tailwindcss\";
- `./types/index.ts` (567 lines, .ts) -- export type Tone = 'professional' | 'casual' | 'playful' | 'luxurious' | 'educational'

## By language
- .ts: 31
- .tsx: 9
