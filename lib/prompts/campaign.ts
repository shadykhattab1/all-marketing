import type { BrandProfile, BusinessProfile, SeoData, CompetitorAnalysis } from '../../types'

// ─── Blog Article ────────────────────────────────────────────────────────────

export function buildBlogPrompt(brand: BrandProfile, profile: BusinessProfile, seoData: SeoData): string {
  return `Write a complete SEO-optimized blog article for this business as JSON.

Business: ${brand.name}
Industry: ${brand.industry ?? brand.niche}
Core Message: ${profile.coreMessage}
Target Audience: ${profile.targetDemographic}
Primary Keywords: ${seoData.primaryKeywords.join(", ")}
Long-tail Keywords: ${seoData.longTailKeywords.join(", ")}
Tone: ${profile.toneOfVoice}

Return this exact JSON structure:
{
  "title": "Compelling blog title with primary keyword, under 70 characters",
  "metaDescription": "SEO meta description under 155 characters with primary keyword",
  "outline": ["Section 1 heading", "Section 2 heading", "Section 3 heading", "Section 4 heading", "Section 5 heading"],
  "fullArticle": "Complete 800-1200 word article in markdown format. Include: engaging introduction with hook, 4-5 sections with H2 headings (## Heading), bullet points where appropriate, statistics or data points, internal linking suggestions in [brackets], strong conclusion with CTA. Naturally incorporate keywords without stuffing.",
  "suggestedSlug": "url-friendly-slug-with-keyword",
  "targetKeyword": "primary target keyword",
  "wordCount": 1000
}`;
}

// ─── Ad Copy ─────────────────────────────────────────────────────────────────

export function buildAdsPrompt(brand: BrandProfile, profile: BusinessProfile): string {
  return `Create Google Ads and Meta (Facebook/Instagram) ad copy variants for this business as JSON.

Business: ${brand.name}
Industry: ${brand.industry ?? brand.niche}
Core Message: ${profile.coreMessage}
USPs: ${profile.uniqueSellingPoints.join(", ")}
Target Audience: ${profile.targetDemographic}
Goals: ${brand.goals ?? ""}

STRICT RULES:
- Google Ads headlines: EXACTLY 30 characters max each
- Google Ads descriptions: EXACTLY 90 characters max each
- Meta primary text: 125 characters for optimal display
- All copy must have a clear CTA

Return this exact JSON:
{
  "googleAds": [
    {"headlines": ["Headline 1 (max 30ch)", "Headline 2 (max 30ch)", "Headline 3 (max 30ch)"], "descriptions": ["Description 1 under 90 characters with clear value prop and CTA", "Description 2 under 90 characters with different angle"]},
    {"headlines": ["Alt H1", "Alt H2", "Alt H3"], "descriptions": ["Alt Desc 1", "Alt Desc 2"]},
    {"headlines": ["Alt H1", "Alt H2", "Alt H3"], "descriptions": ["Alt Desc 1", "Alt Desc 2"]}
  ],
  "metaAds": [
    {"primaryText": "Engaging text that speaks to the audience pain point and presents your solution. Include social proof if possible.", "headline": "Attention-grabbing headline under 40 chars", "description": "Supporting text under 30 chars", "ctaButton": "Learn More"},
    {"primaryText": "Different angle - focus on benefits and transformation", "headline": "Second variant headline", "description": "Supporting text", "ctaButton": "Get Started"},
    {"primaryText": "Third angle - urgency or exclusivity", "headline": "Third variant headline", "description": "Supporting text", "ctaButton": "Sign Up"}
  ],
  "targetAudience": "Specific targeting suggestion for ad platforms",
  "estimatedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;
}

// ─── Email Sequence ──────────────────────────────────────────────────────────

export function buildEmailSequencePrompt(brand: BrandProfile, profile: BusinessProfile): string {
  return `Create a 6-email welcome/nurture sequence for this business as JSON.

Business: ${brand.name}
Industry: ${brand.industry ?? brand.niche}
Core Message: ${profile.coreMessage}
Tone: ${profile.toneOfVoice}
Target Audience: ${profile.targetDemographic}
USPs: ${profile.uniqueSellingPoints.join(", ")}
Goals: ${brand.goals ?? ""}

The sequence should take a cold lead through awareness → interest → desire → action.

Return this exact JSON:
{
  "sequenceName": "Welcome Series for ${brand.name}",
  "goal": "One sentence describing the sequence goal",
  "emails": [
    {"day": 0, "subject": "Welcome email subject (max 50 chars, high open rate)", "previewText": "Preview text under 90 chars", "body": "Full email body in plain text. 150-200 words. Warm welcome, set expectations, deliver immediate value.", "cta": "CTA button text", "ctaUrl": "/welcome"},
    {"day": 2, "subject": "Day 2 subject - deliver value", "previewText": "Preview text", "body": "Educational content that solves a quick problem. 150-200 words.", "cta": "CTA text", "ctaUrl": "/resource"},
    {"day": 5, "subject": "Day 5 subject - social proof", "previewText": "Preview text", "body": "Customer story or case study. Build trust. 150-200 words.", "cta": "CTA text", "ctaUrl": "/testimonials"},
    {"day": 8, "subject": "Day 8 subject - deeper value", "previewText": "Preview text", "body": "Advanced tip or exclusive content. Position as expert. 150-200 words.", "cta": "CTA text", "ctaUrl": "/guide"},
    {"day": 12, "subject": "Day 12 subject - soft offer", "previewText": "Preview text", "body": "Introduce your product/service naturally. Connect to problems solved in earlier emails. 150-200 words.", "cta": "CTA text", "ctaUrl": "/offer"},
    {"day": 15, "subject": "Day 15 subject - urgency/close", "previewText": "Preview text", "body": "Final push with time-limited offer or exclusive deal. Recap value delivered. Strong CTA. 150-200 words.", "cta": "CTA text", "ctaUrl": "/special-offer"}
  ]
}`;
}

// ─── Content Calendar ────────────────────────────────────────────────────────

export function buildContentCalendarPrompt(brand: BrandProfile, profile: BusinessProfile, seoData: SeoData): string {
  return `Create a 4-week content calendar for this business as JSON.

Business: ${brand.name}
Industry: ${brand.industry ?? brand.niche}
Core Message: ${profile.coreMessage}
Target Audience: ${profile.targetDemographic}
Tone: ${profile.toneOfVoice}
Keywords: ${seoData.primaryKeywords.join(", ")}
USPs: ${profile.uniqueSellingPoints.join(", ")}

Plan 3 posts per week across Instagram, Twitter/X, and LinkedIn. Include 1 blog article per week.
Mix content types: educational, behind-the-scenes, promotional (80/20 rule), engagement posts.

Return this exact JSON:
{
  "month": "Month 1 Content Plan",
  "theme": "Overarching monthly theme",
  "entries": [
    {"day": "Week 1 Monday", "platform": "Instagram", "contentType": "Carousel Post", "topic": "Specific topic", "captionDraft": "Ready-to-post caption with emojis and line breaks, 150-250 chars", "hashtags": ["hashtag1", "hashtag2", "hashtag3"]},
    {"day": "Week 1 Wednesday", "platform": "Twitter", "contentType": "Thread", "topic": "Topic", "captionDraft": "Tweet 1 of thread, under 280 chars", "hashtags": ["hashtag1"]},
    {"day": "Week 1 Friday", "platform": "LinkedIn", "contentType": "Article", "topic": "Topic", "captionDraft": "Professional post, 100-200 words", "hashtags": ["hashtag1", "hashtag2"]},
    {"day": "Week 1 Sunday", "platform": "Blog", "contentType": "Article", "topic": "Blog topic targeting keyword", "captionDraft": "Blog post brief: what to cover and key points", "hashtags": []}
  ]
}

Create 16 entries total (4 per week x 4 weeks). Vary the platforms and content types.`;
}

// ─── Competitor Analysis ─────────────────────────────────────────────────────

export function buildCompetitorAnalysisPrompt(brand: BrandProfile, profile: BusinessProfile, competitors: string): string {
  return `Analyze these competitors and provide strategic positioning insights as JSON.

Your Business: ${brand.name}
Industry: ${brand.industry ?? brand.niche}
Your Core Message: ${profile.coreMessage}
Your USPs: ${profile.uniqueSellingPoints.join(", ")}
Your Target Audience: ${profile.targetDemographic}

Competitors to analyze: ${competitors}

Research each competitor thoroughly based on the industry and what's publicly known. If competitor names are vague, make reasonable inferences based on the industry.

Return this exact JSON:
{
  "competitors": [
    {"name": "Competitor 1", "strengths": ["Strength 1", "Strength 2", "Strength 3"], "weaknesses": ["Weakness 1", "Weakness 2"], "keyMessaging": "Their main marketing message/positioning", "estimatedKeywords": ["keyword1", "keyword2", "keyword3"]}
  ],
  "positioningGaps": ["Gap 1: Area where no competitor is strong", "Gap 2: Underserved audience segment", "Gap 3: Unaddressed pain point"],
  "keywordOpportunities": ["keyword opportunity 1", "keyword opportunity 2", "keyword opportunity 3", "keyword opportunity 4", "keyword opportunity 5"],
  "messagingDifferentiators": ["How to position against Competitor 1", "How to position against Competitor 2", "Overall unique angle"],
  "strategicRecommendations": ["Specific action item 1", "Specific action item 2", "Specific action item 3", "Specific action item 4"]
}`;
}

// ─── SEO Comparison ─────────────────────────────────────────────────────────

export function buildSeoComparisonPrompt(
  brand: BrandProfile,
  profile: BusinessProfile,
  seoData: SeoData,
  competitors: string,
  competitorAnalysis?: CompetitorAnalysis
): string {
  const competitorKeywords = competitorAnalysis?.competitors
    .map(c => `${c.name}: ${c.estimatedKeywords.join(", ")}`)
    .join("\n    ") ?? "Not available";

  const industry = brand.industry ?? brand.niche

  return `You are an expert SEO strategist. Compare the SEO strategy of "${brand.name}" against its competitors and provide a detailed competitive SEO analysis as JSON.

YOUR BUSINESS SEO PROFILE:
  Business: ${brand.name}
  Industry: ${industry}
  Website: ${brand.websiteUrl ?? "Not provided"}
  Core Message: ${profile.coreMessage}
  Target Audience: ${profile.targetDemographic}
  Primary Keywords: ${seoData.primaryKeywords.join(", ")}
  Secondary Keywords: ${seoData.secondaryKeywords.join(", ")}
  Long-tail Keywords: ${seoData.longTailKeywords.join(", ")}
  Meta Title: ${seoData.metaTitle}
  Meta Description: ${seoData.metaDescription}

COMPETITORS TO ANALYZE: ${competitors}
KNOWN COMPETITOR KEYWORDS:
    ${competitorKeywords}

Score each business on a 0-100 scale across 4 SEO dimensions:
- keywordScore: keyword relevance, variety, search volume targeting, long-tail coverage
- contentScore: estimated content depth, topical authority, content freshness signals
- technicalScore: site structure, mobile readiness, page speed signals, schema markup potential
- authorityScore: estimated domain authority, backlink profile strength, brand recognition

For YOUR business, base scores on the SEO strategy provided above.
For COMPETITORS, estimate scores based on what's publicly known about their online presence in the ${industry} industry.

Return this exact JSON:
{
  "yourScore": {
    "name": "${brand.name}",
    "overallScore": 72,
    "keywordScore": 75,
    "contentScore": 68,
    "technicalScore": 70,
    "authorityScore": 65,
    "topKeywords": ["your top 5 keywords from the strategy"],
    "contentStrengths": ["Strength 1", "Strength 2"],
    "contentWeaknesses": ["Weakness 1", "Weakness 2"]
  },
  "competitors": [
    {
      "name": "Competitor Name",
      "overallScore": 78,
      "keywordScore": 80,
      "contentScore": 75,
      "technicalScore": 82,
      "authorityScore": 76,
      "topKeywords": ["competitor keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
      "contentStrengths": ["Strength 1", "Strength 2"],
      "contentWeaknesses": ["Weakness 1", "Weakness 2"]
    }
  ],
  "keywordGaps": [
    {"keyword": "keyword phrase", "yourStatus": "missing", "competitorStatus": "ranking", "searchIntent": "commercial", "priority": "high", "recommendation": "Create a dedicated landing page targeting this keyword"},
    {"keyword": "another keyword", "yourStatus": "ranking", "competitorStatus": "missing", "searchIntent": "informational", "priority": "medium", "recommendation": "You have an advantage — strengthen with more content"},
    {"keyword": "shared keyword", "yourStatus": "weak", "competitorStatus": "ranking", "searchIntent": "transactional", "priority": "high", "recommendation": "Improve on-page optimization and add supporting content"}
  ],
  "contentGaps": [
    "Topic area your competitors cover that you don't",
    "Content format competitors use effectively (videos, guides, tools)",
    "Industry subtopic with search demand you're not addressing"
  ],
  "technicalAdvantages": ["Your technical SEO advantage 1", "Advantage 2"],
  "technicalDisadvantages": ["Technical area where competitors are stronger 1", "Area 2"],
  "quickWins": [
    "Specific SEO action you can take this week for immediate impact",
    "Another quick-win opportunity based on competitor gaps",
    "Low-effort, high-reward SEO improvement"
  ],
  "longTermStrategy": [
    "Strategic SEO initiative for the next 3-6 months",
    "Content authority building recommendation",
    "Backlink and partnership strategy",
    "Technical SEO infrastructure improvement"
  ],
  "summary": "2-3 sentence executive summary comparing your SEO position against competitors, highlighting the biggest opportunity and biggest threat."
}

Provide 5-8 keyword gaps covering a mix of all statuses and intents. Be specific and actionable in all recommendations.`;
}

// ─── Brand Kit ───────────────────────────────────────────────────────────────

export function buildBrandKitPrompt(brand: BrandProfile, profile: BusinessProfile): string {
  return `Design a complete brand kit for this business as JSON.

Business: ${brand.name}
Industry: ${brand.industry ?? brand.niche}
Brand Personality: ${profile.brandPersonality}
Tone of Voice: ${profile.toneOfVoice}
Target Audience: ${profile.targetDemographic}
Competitive Edge: ${profile.competitiveEdge}

Create a cohesive visual identity that matches the brand personality. Choose colors that evoke the right emotions for the target audience and industry.

Return this exact JSON:
{
  "colors": [
    {"name": "Primary", "hex": "#XXXXXX", "usage": "Main brand color — buttons, headers, key CTAs"},
    {"name": "Secondary", "hex": "#XXXXXX", "usage": "Supporting color — accents, secondary buttons"},
    {"name": "Accent", "hex": "#XXXXXX", "usage": "Highlight color — badges, notifications, links"},
    {"name": "Dark", "hex": "#XXXXXX", "usage": "Text and dark backgrounds"},
    {"name": "Light", "hex": "#XXXXXX", "usage": "Backgrounds, cards, light sections"},
    {"name": "Neutral", "hex": "#XXXXXX", "usage": "Borders, subtle text, dividers"}
  ],
  "primaryFont": "Font name (e.g., Inter, Poppins, Playfair Display) — choose from Google Fonts",
  "secondaryFont": "Complementary font name from Google Fonts",
  "fontPairingRationale": "Why these fonts work together and match the brand personality",
  "brandGuidelines": "3-4 paragraph brand style guide covering voice, visual style, photography direction, and overall aesthetic",
  "doList": ["Do: use active voice", "Do: include customer testimonials", "Do: maintain consistent color usage", "Do: use high-quality imagery", "Do: keep messaging benefit-focused"],
  "dontList": ["Don't: use jargon without explanation", "Don't: use stock photos that feel generic", "Don't: mix too many colors", "Don't: write long paragraphs", "Don't: be overly salesy"]
}`;
}

// ─── Website Copy ─────────────────────────────────────────────────────────────

export function buildWebsiteCopyPrompt(brand: BrandProfile, profile: BusinessProfile): string {
  return `Write compelling website copy for this business as JSON.

Business: ${brand.name}
Industry: ${brand.industry ?? brand.niche}
Core Message: ${profile.coreMessage}
Tone: ${profile.toneOfVoice}
USPs: ${profile.uniqueSellingPoints.join(", ")}
Target Audience: ${profile.targetDemographic}
Goals: ${brand.goals ?? ""}

Return this exact JSON structure:
{
  "heroHeadline": "Bold, punchy hero headline. Max 8 words. No fluff. Make it memorable.",
  "heroSubheadline": "1-2 sentences that expand the headline and speak directly to the target audience's desire or pain point.",
  "tagline": "Short memorable brand tagline. 3-7 words. Should work as a slogan.",
  "aboutSection": "3 short paragraphs for the About page. Paragraph 1: origin story or mission. Paragraph 2: what makes you different. Paragraph 3: the promise to customers.",
  "features": [
    {"title": "Feature/Benefit 1 title", "description": "1-2 sentence description of this benefit"},
    {"title": "Feature/Benefit 2 title", "description": "1-2 sentence description"},
    {"title": "Feature/Benefit 3 title", "description": "1-2 sentence description"}
  ],
  "ctaText": "Primary CTA button text (2-5 words)",
  "ctaSubtext": "Short reassurance below the CTA button (e.g. 'No credit card required')"
}`;
}

// ─── SEO + AEO ───────────────────────────────────────────────────────────────

export function buildSeoPrompt(brand: BrandProfile, profile: BusinessProfile): string {
  return `Generate SEO and AEO (Answer Engine Optimization) data for this business as JSON.

Business: ${brand.name}
Industry: ${brand.industry ?? brand.niche}
Core Message: ${profile.coreMessage}
Target: ${profile.targetDemographic}
USPs: ${profile.uniqueSellingPoints.join(", ")}
Website: ${brand.websiteUrl ?? "Not provided"}

Return this exact JSON structure:
{
  "seoData": {
    "primaryKeywords": ["keyword1", "keyword2", "keyword3"],
    "secondaryKeywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
    "longTailKeywords": ["long tail phrase 1", "long tail phrase 2", "long tail phrase 3"],
    "metaTitle": "SEO-optimized page title, strictly under 60 characters",
    "metaDescription": "Compelling meta description under 155 characters that includes the primary keyword",
    "contentOutline": ["Introduction: Compelling hook", "Section 1: Problem or Need", "Section 2: Solution Overview", "Section 3: Key Benefits", "Section 4: Social Proof", "Section 5: Clear Call to Action"]
  },
  "aeoData": {
    "questionsAndAnswers": [
      {"question": "What is ${brand.name}?", "answer": "Clear, concise answer optimized for AI search"},
      {"question": "How does [main product/service] work?", "answer": "Step-by-step answer that AI assistants will surface"},
      {"question": "Why choose ${brand.name} over competitors?", "answer": "Compelling answer with specific differentiators"},
      {"question": "Who is ${brand.name} for?", "answer": "Specific audience definition answer"}
    ],
    "faqSchema": "{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"Q1?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"A1\"}}]}",
    "aiSearchSummary": "2-3 sentences written specifically to appear in AI search results and featured snippets. Concise, factual, and comprehensive."
  }
}`;
}

export function buildAeoPrompt(brand: BrandProfile, profile: BusinessProfile): string {
  return buildSeoPrompt(brand, profile)
}

// ─── Social Content ───────────────────────────────────────────────────────────

export function buildSocialContentPrompt(
  brand: BrandProfile,
  profile: BusinessProfile,
  seoData: SeoData
): string {
  return `Create platform-optimized social media content for this business as JSON.

Business: ${brand.name}
Industry: ${brand.industry ?? brand.niche}
Core Message: ${profile.coreMessage}
Tone of Voice: ${profile.toneOfVoice}
Target Audience: ${profile.targetDemographic}
Primary Keywords: ${seoData.primaryKeywords.slice(0, 3).join(", ")}
USPs: ${profile.uniqueSellingPoints.slice(0, 2).join(", ")}

Return this exact JSON structure:
{
  "instagram": {
    "postText": "Engaging Instagram caption with emojis, line breaks for readability, storytelling hook in the first line. 150-300 characters before hashtags.",
    "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7"],
    "characterCount": 250
  },
  "twitter": {
    "postText": "Punchy tweet strictly under 240 characters. Direct, impactful, hooks with first word, clear value proposition.",
    "hashtags": ["hashtag1", "hashtag2"],
    "characterCount": 220
  },
  "linkedin": {
    "postText": "Professional LinkedIn post 150-200 words. Open with a bold statement or provocative question. Include a specific insight or statistic. Tell a brief story or share a lesson. End with a clear call to action. Use line breaks for readability. Minimal emojis.",
    "hashtags": ["ProfessionalHashtag1", "IndustryTopic2", "RelevantField3"],
    "characterCount": 400
  }
}`;
}

// ─── Brand Analysis (BusinessProfile derivation) ─────────────────────────────

export function buildAnalyzePrompt(brand: BrandProfile): string {
  return `Analyze this business and return a brand profile as JSON.

Business Details:
Name: ${brand.name}
Industry: ${brand.industry ?? brand.niche}
Description: ${brand.description ?? brand.keyMessages.join(". ")}
Target Audience: ${brand.targetAudience}
Products/Services: ${brand.products.join(", ")}
Desired Brand Voice: ${brand.brandVoice ?? brand.tone}
Goals: ${brand.goals ?? ""}
Website: ${brand.websiteUrl ?? "Not provided"}

Return this exact JSON structure:
{
  "summary": "2-3 sentences capturing the business essence and value proposition",
  "uniqueSellingPoints": ["USP 1", "USP 2", "USP 3", "USP 4"],
  "brandPersonality": "Description of brand personality traits",
  "targetDemographic": "Specific description of ideal customer including demographics and psychographics",
  "competitiveEdge": "What makes this business uniquely better than competitors",
  "toneOfVoice": "Communication style description",
  "coreMessage": "The single most powerful message for marketing this business"
}`;
}

// ─── Sales Catalogue ─────────────────────────────────────────────────────────

export function buildCataloguePrompt(brand: BrandProfile, profile: BusinessProfile): string {
  return `Create a professional sales catalogue for this business as JSON.

Business: ${brand.name}
Tagline: ${brand.tagline ?? ''}
Industry: ${brand.industry ?? brand.niche}
Products/Services: ${brand.products.join(', ')}
USPs: ${profile.uniqueSellingPoints.join(', ')}
Target Audience: ${profile.targetDemographic}
Tone: ${profile.toneOfVoice}
Core Message: ${profile.coreMessage}

Return this exact JSON:
{
  "coverTitle": "Bold catalogue title that sells the brand promise (max 8 words)",
  "coverTagline": "One-line tagline that captures what makes this brand different",
  "companyOverview": "3-4 sentence company overview for the inside cover. Compelling, not corporate. Mentions the mission, who it's for, and the transformation it delivers.",
  "products": [
    {
      "name": "Product/Service name",
      "description": "2-3 sentence description that focuses on benefits, not features. Speak to what the customer gains.",
      "price": "Price or pricing model (e.g. 'From $299', 'Custom quote', 'Starting at $49/mo')",
      "features": ["Key feature 1", "Key feature 2", "Key feature 3", "Key feature 4"],
      "highlight": "Optional badge like 'Best Seller', 'New', 'Most Popular', 'Premium' — or omit"
    }
  ],
  "whyChooseUs": [
    "Reason 1 — specific and credible, not generic",
    "Reason 2",
    "Reason 3",
    "Reason 4",
    "Reason 5"
  ],
  "testimonial": {
    "quote": "Authentic-sounding testimonial that mentions a specific result or benefit",
    "author": "First Name L.",
    "company": "Company or job title"
  },
  "contactCta": "Call-to-action text for the back page (e.g. 'Ready to transform your business? Let's talk.')",
  "footerText": "Short footer with website, tagline, or brand promise"
}

Generate products for each of the listed products/services. Be specific and sales-focused.`;
}

// ─── Sales Kit ────────────────────────────────────────────────────────────────

export function buildSalesKitPrompt(brand: BrandProfile, profile: BusinessProfile): string {
  return `Create a complete sales kit / pitch deck outline for this business as JSON.

Business: ${brand.name}
Industry: ${brand.industry ?? brand.niche}
Core Message: ${profile.coreMessage}
Competitive Edge: ${profile.competitiveEdge}
USPs: ${profile.uniqueSellingPoints.join(', ')}
Target Audience: ${profile.targetDemographic}
Products: ${brand.products.join(', ')}
Goals: ${brand.goals ?? 'grow revenue and customer base'}

Return this exact JSON:
{
  "executiveSummary": "2-3 sentence elevator pitch. Covers: who you are, what problem you solve, why you're the best choice.",
  "problem": "Describe the core problem your target customer faces. 2-3 sentences. Be specific — use numbers or pain points if possible.",
  "solution": "How your product/service solves that problem. 2-3 sentences. Connect directly to the problem statement.",
  "differentiators": [
    "Differentiator 1 — specific, provable claim",
    "Differentiator 2",
    "Differentiator 3",
    "Differentiator 4"
  ],
  "pricing": [
    {"tier": "Tier name", "price": "Price (e.g. '$99/mo')", "summary": "1-sentence description of what's included"},
    {"tier": "Tier name", "price": "Price", "summary": "What's included"},
    {"tier": "Tier name", "price": "Price", "summary": "What's included"}
  ],
  "socialProof": "2-3 sentences of social proof — could be stats, testimonials, or client logos. Make it credible and specific.",
  "cta": "The single next step you want prospects to take (e.g. 'Book a free 30-minute demo', 'Start your free trial')",
  "slides": [
    {"title": "Cover", "content": "Brand name + tagline + presenter info placeholder", "bullets": []},
    {"title": "The Problem", "content": "Problem statement for the slide", "bullets": ["Pain point 1", "Pain point 2", "Pain point 3"], "stat": "71%", "statLabel": "of businesses struggle with this"},
    {"title": "Our Solution", "content": "Solution overview for the slide", "bullets": ["How it works 1", "How it works 2", "How it works 3"]},
    {"title": "Why Us", "content": "Competitive positioning statement", "bullets": ["Differentiator 1", "Differentiator 2", "Differentiator 3"]},
    {"title": "Pricing", "content": "Simple pricing overview", "bullets": ["Tier 1 summary", "Tier 2 summary", "Tier 3 summary"]},
    {"title": "Social Proof", "content": "Results and testimonials", "bullets": ["Result or testimonial 1", "Result or testimonial 2"]},
    {"title": "Next Steps", "content": "CTA and contact details placeholder", "bullets": ["Step 1", "Step 2", "Step 3"]}
  ]
}`;
}

export const JSON_SYSTEM_PROMPT = `You are a JSON API. Return ONLY valid JSON with no markdown formatting, no code fences, no explanation. Just raw JSON that can be passed directly to JSON.parse().`
