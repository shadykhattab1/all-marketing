// ─── Shared Primitives ───────────────────────────────────────────────────────

export type Tone = 'professional' | 'casual' | 'playful' | 'luxurious' | 'educational'

export type Platform = 'facebook' | 'instagram' | 'tiktok' | 'linkedin'

export type PostStatus = 'draft' | 'approved' | 'rejected' | 'published'

export type PrimaryGoal = 'leads' | 'sales' | 'awareness' | 'followers'

// ─── Brand ───────────────────────────────────────────────────────────────────

/**
 * Primary brand input type — the foundation for all generation workflows.
 * Merges reelforge BrandProfile (authoritative) with marketing-ai BusinessInput
 * and valkyn-amplify OnboardingAnswers fields.
 */
export interface BrandProfile {
  // Core identity (reelforge)
  name: string
  tagline?: string
  niche: string
  tone: Tone
  targetAudience: string
  products: string[]
  colors: string[]
  keyMessages: string[]
  extractedFrom: 'url' | 'photo' | 'manual' | 'social'
  sourceUrl?: string

  // Extended business context (from marketing-ai BusinessInput)
  industry?: string
  description?: string
  brandVoice?: string
  goals?: string
  websiteUrl?: string

  // Campaign targeting (from valkyn-amplify OnboardingAnswers)
  monthlyBudget?: number
  primaryGoal?: PrimaryGoal
  contentRestrictions?: string
  idealCustomer?: string
  existingContent?: string
}

// ─── Reel Types (reelforge — exact names preserved) ──────────────────────────

export interface HookFormat {
  id: string
  label: string
  description: string
  structure: string
}

export interface TextOverlay {
  opening: string   // Large hook text
  bullets: string[] // 3-5 slide bullets
  closing: string   // CTA text
}

export interface ReelScript {
  hookFormatId: string
  hookFormatLabel: string
  hook: string          // Opening line, < 8 words, scroll-stopping
  body: string[]        // 3-5 content bullets
  cta: string           // Call to action
  voiceover: string     // Full narration, 15-30 second read
  caption: {
    instagram: string   // IG caption with emojis
    tiktok: string      // TikTok caption, shorter
  }
  hashtags: {
    branded: string[]   // 2-3 brand hashtags
    niche: string[]     // 15-20 niche hashtags (<500K posts)
    broad: string[]     // 10 broad hashtags (1M+ posts)
  }
  textOverlays: TextOverlay
}

export interface VideoClip {
  url: string
  durationSeconds: number
  index: number
}

// ─── Marketing-AI Content Types ───────────────────────────────────────────────

export interface BusinessProfile {
  summary: string
  uniqueSellingPoints: string[]
  brandPersonality: string
  targetDemographic: string
  competitiveEdge: string
  toneOfVoice: string
  coreMessage: string
}

export interface SeoData {
  primaryKeywords: string[]
  secondaryKeywords: string[]
  longTailKeywords: string[]
  metaTitle: string
  metaDescription: string
  contentOutline: string[]
}

export interface AeoData {
  questionsAndAnswers: { question: string; answer: string }[]
  faqSchema: string
  aiSearchSummary: string
}

export interface ImageData {
  prompt: string
  imageUrl: string
  revisedPrompt?: string
}

export interface PlatformContent {
  postText: string
  hashtags: string[]
  characterCount: number
}

export interface SocialContent {
  instagram: PlatformContent
  twitter: PlatformContent
  linkedin: PlatformContent
}

export interface WebsiteCopyFeature {
  title: string
  description: string
}

export interface WebsiteCopy {
  heroHeadline: string
  heroSubheadline: string
  tagline: string
  aboutSection: string
  features: WebsiteCopyFeature[]
  ctaText: string
  ctaSubtext: string
}

export interface BlogArticle {
  title: string
  metaDescription: string
  outline: string[]
  fullArticle: string
  suggestedSlug: string
  targetKeyword: string
  wordCount: number
}

export interface GoogleAdVariant {
  headlines: string[]     // 3 headlines, max 30 chars each
  descriptions: string[]  // 2 descriptions, max 90 chars each
}

export interface MetaAdVariant {
  primaryText: string
  headline: string
  description: string
  ctaButton: string
}

export interface AdCopy {
  googleAds: GoogleAdVariant[]   // 3 variants
  metaAds: MetaAdVariant[]       // 3 variants
  targetAudience: string
  estimatedKeywords: string[]
}

export interface SequenceEmail {
  day: number
  subject: string
  previewText: string
  body: string
  cta: string
  ctaUrl: string
}

export interface EmailSequence {
  sequenceName: string
  goal: string
  emails: SequenceEmail[]
}

export interface CalendarEntry {
  day: string           // "Week 1 Monday", etc.
  platform: string      // Instagram, Twitter, LinkedIn, Blog
  contentType: string   // Post, Story, Article, Reel idea
  topic: string
  captionDraft: string
  hashtags: string[]
}

export interface ContentCalendar {
  month: string
  theme: string
  entries: CalendarEntry[]
}

export interface CompetitorProfile {
  name: string
  strengths: string[]
  weaknesses: string[]
  keyMessaging: string
  estimatedKeywords: string[]
}

export interface CompetitorAnalysis {
  competitors: CompetitorProfile[]
  positioningGaps: string[]
  keywordOpportunities: string[]
  messagingDifferentiators: string[]
  strategicRecommendations: string[]
}

export interface SeoCompetitorScore {
  name: string
  overallScore: number      // 0-100
  keywordScore: number      // 0-100
  contentScore: number      // 0-100
  technicalScore: number    // 0-100
  authorityScore: number    // 0-100
  topKeywords: string[]
  contentStrengths: string[]
  contentWeaknesses: string[]
}

export interface KeywordGap {
  keyword: string
  yourStatus: 'ranking' | 'missing' | 'weak'
  competitorStatus: 'ranking' | 'missing' | 'weak'
  searchIntent: 'informational' | 'commercial' | 'transactional' | 'navigational'
  priority: 'high' | 'medium' | 'low'
  recommendation: string
}

export interface SeoComparison {
  yourScore: SeoCompetitorScore
  competitors: SeoCompetitorScore[]
  keywordGaps: KeywordGap[]
  contentGaps: string[]
  technicalAdvantages: string[]
  technicalDisadvantages: string[]
  quickWins: string[]
  longTermStrategy: string[]
  summary: string
}

export interface ColorPalette {
  name: string
  hex: string
  usage: string  // "Primary", "Secondary", "Accent", "Background", "Text"
}

export interface BrandKit {
  colors: ColorPalette[]
  primaryFont: string
  secondaryFont: string
  fontPairingRationale: string
  brandGuidelines: string
  doList: string[]
  dontList: string[]
}

// ─── Sales Materials (from marketing-ai — kept for PPTX/PDF export) ──────────

export interface SalesBrandData {
  productName: string
  tagline: string
  websiteUrl: string
  logoUrl?: string
  primaryColor: string
  secondaryColor: string
  industry: string
  targetMarket: string
}

export interface PainStat {
  number: string
  unit: string
  label: string
  description: string
}

export interface SalesProblemData {
  burningPlatformHeadline: string
  painStats: PainStat[]
  competitors: string[]
}

export interface ModuleCapability {
  name: string
  description: string
}

export interface SalesModule {
  name: string
  shortDescription: string
  isHeroFeature: boolean
  capabilities: ModuleCapability[]
}

export interface SalesModuleData {
  modules: SalesModule[]
  channels: string[]
}

export interface SalesPersona {
  name: string
  painQuote: string
  heroStat: string
  heroStatLabel: string
  valueProps: string[]
  avgCostSaved: number
  adminHoursSaved: number
  revenueRecovered: number
}

export interface SalesPersonaData {
  personas: SalesPersona[]
}

export interface PricingTier {
  name: string
  subtitle: string
  price: string
  features: string[]
  ctaLabel: string
  isHighlighted: boolean
}

export interface SalesPricingData {
  tiers: PricingTier[]
  freeTrialDays: number
  creditCardRequired: boolean
  annualDiscount: number
}

export interface TrustBadge {
  name: string
  description: string
}

export interface SalesTrustData {
  badges: TrustBadge[]
  testimonial: {
    quote: string
    authorName: string
    authorTitle: string
    company: string
  }
  socialProofStat: string
}

export interface SalesInput {
  brand: SalesBrandData
  problem: SalesProblemData
  modules: SalesModuleData
  personas: SalesPersonaData
  pricing: SalesPricingData
  trust: SalesTrustData
}

export interface SalesMaterialsResult {
  pitchPageHtml: string
  catalogSections: string[]
  pptxSlides: Array<{ title: string; content: string; notes: string }>
  pdfPages: Array<{ title: string; content: string }>
}

// ─── Valkyn Amplify Types ────────────────────────────────────────────────────

export interface ICP {
  ageRange: string
  painPoints: string[]
  desires: string[]
  location: string
  interests?: string[]
}

export interface CompetitorData {
  name: string
  weaknesses: string[]
  topFormats: string[]
}

export interface BrandDNA {
  tone: string
  icp: ICP
  contentPillars: string[]
  visualStyle: string
  competitorData: CompetitorData[]
  restrictions: string
}

export interface WeeklyBriefData {
  theme: string
  platformPriority: Platform[]
  budgetAllocation: Record<Platform, number>
  hooksToTest: string[]
  insights: string
  competitorSignals: string
}

export interface ContentPackage {
  platform: Platform
  copy: string
  hashtags: string
  imagePrompt: string
  imageUrl?: string
  scheduledAt?: Date
}

export interface MetricsSnapshot {
  impressions: number
  clicks: number
  spend: number
  leads: number
  cpl: number
  ctr: number
}

export interface DashboardStats {
  totalLeads: number
  totalSpend: number
  avgCpl: number
  contentPosts: number
  leadsChange: number
  spendChange: number
}

export interface AgentRunResult {
  success: boolean
  agentName: string
  output: unknown
  error?: string
  durationMs: number
}

// ─── Campaign State (renamed from WizardState, auth/billing fields removed) ──

export interface CampaignState {
  brandProfile: BrandProfile | null
  businessProfile: BusinessProfile | null
  seoData: SeoData | null
  aeoData: AeoData | null
  imageData: ImageData | null
  socialContent: SocialContent | null
  websiteCopy: WebsiteCopy | null
  blogArticle: BlogArticle | null
  adCopy: AdCopy | null
  emailSequence: EmailSequence | null
  contentCalendar: ContentCalendar | null
  competitorAnalysis: CompetitorAnalysis | null
  seoComparison: SeoComparison | null
  brandKit: BrandKit | null
}

// ─── Unified Campaign ─────────────────────────────────────────────────────────

// ─── Sales Catalogue ─────────────────────────────────────────────────────────

export interface CatalogueProduct {
  name: string
  description: string
  price?: string
  features: string[]
  highlight?: string   // "Best Seller", "New", "Premium", etc.
}

export interface SalesCatalogue {
  coverTitle: string
  coverTagline: string
  companyOverview: string
  products: CatalogueProduct[]
  whyChooseUs: string[]
  testimonial?: { quote: string; author: string; company: string }
  contactCta: string
  footerText: string
}

// ─── Sales Kit ────────────────────────────────────────────────────────────────

export interface SalesKitSlide {
  title: string
  content: string
  bullets?: string[]
  stat?: string
  statLabel?: string
}

export interface SalesKit {
  executiveSummary: string
  problem: string
  solution: string
  differentiators: string[]
  pricing: Array<{ tier: string; price: string; summary: string }>
  socialProof: string
  cta: string
  slides: SalesKitSlide[]
}

/** All 13+ generator outputs bundled into a single campaign payload. */
export interface CampaignContent {
  brandKit?: BrandKit
  seo?: SeoData
  aeo?: AeoData
  blog?: BlogArticle
  ads?: AdCopy
  emailSequence?: EmailSequence
  socialContent?: SocialContent
  websiteCopy?: WebsiteCopy
  contentCalendar?: ContentCalendar
  competitors?: CompetitorAnalysis
  seoComparison?: SeoComparison
  image?: string            // DALL-E URL
  salesMaterials?: SalesMaterialsResult
  catalogue?: SalesCatalogue
  salesKit?: SalesKit
}

/** Reel generation result for a single reel. */
export interface ReelResult {
  script: ReelScript
  videoUrls: string[]
  totalClips: number
  totalDuration: number
  status: 'pending' | 'generating' | 'complete' | 'failed'
}

/** Top-level campaign entity persisted across sessions. */
export interface Campaign {
  id: string
  sessionId: string
  brandName: string
  brandProfile: BrandProfile
  content?: CampaignContent
  reels?: ReelResult[]
  status: 'draft' | 'generating' | 'complete' | 'distributed'
  shareToken?: string
  createdAt: string
  updatedAt: string
}

/** Renamed from KitData — full campaign + generated assets. */
export interface CampaignData {
  campaign: Campaign
  state: CampaignState
}

// ─── API Request / Response Types ────────────────────────────────────────────

export interface BrandAnalysisResponse {
  brand: BrandProfile
}

export interface CampaignGenerationRequest {
  sessionId: string
  brand: BrandProfile
}

export interface ReelGenerationRequest {
  sessionId: string
  brand: BrandProfile
  count?: number
  reelIdea?: string
}

export interface ExtractBrandRequest {
  url?: string
  imageBase64?: string
  brandName?: string
  brandNiche?: string
  brandTone?: Tone
  brandAudience?: string
  socialUrl?: string
  reelIdea?: string
}

export interface GenerateScriptsRequest {
  brand: BrandProfile
  count: number
  excludeHookIds?: string[]
}

export interface GenerateScriptsResponse {
  scripts: ReelScript[]
}

// ─── Generation Session & Steps ──────────────────────────────────────────────

export interface GenerationSession {
  id: string
  brand: BrandProfile
  reels: ReelResult[]
  inputType: ('photo' | 'url' | 'manual' | 'social')[]
  uploadedImageBase64?: string
  reelIdea?: string
  createdAt: string
}

export interface GenerationStep {
  id: string
  label: string
  status: 'waiting' | 'active' | 'complete' | 'error'
}
