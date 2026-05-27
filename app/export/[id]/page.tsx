import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import type { Campaign, SalesCatalogue, SalesKit, CampaignContent } from '@/types'
import { PrintButton } from './PrintButton'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ doc?: string }>
}

// ─── Catalogue HTML ────────────────────────────────────────────────────────────

function CatalogueExport({ catalogue, brand }: { catalogue: SalesCatalogue; brand: Campaign['brandProfile'] }) {
  const primaryColor = '#1F4E79'

  return (
    <div className="export-doc">
      {/* Cover */}
      <div className="page cover-page" style={{ backgroundColor: primaryColor }}>
        <div className="cover-content">
          <p className="cover-label">PRODUCT CATALOGUE</p>
          <h1 className="cover-title">{catalogue.coverTitle}</h1>
          <p className="cover-tagline">{catalogue.coverTagline}</p>
          <div className="cover-divider" />
          <p className="cover-brand">{brand.name}</p>
          {brand.tagline && <p className="cover-brand-tagline">{brand.tagline}</p>}
        </div>
      </div>

      {/* Company Overview */}
      <div className="page">
        <div className="page-header">
          <h2>About Us</h2>
          <div className="header-line" style={{ backgroundColor: primaryColor }} />
        </div>
        <p className="overview-text">{catalogue.companyOverview}</p>
      </div>

      {/* Products */}
      {catalogue.products.map((product, i) => (
        <div key={i} className="page">
          <div className="page-header">
            <div className="product-number" style={{ backgroundColor: primaryColor }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <h2>{product.name}</h2>
            {product.highlight && (
              <span className="product-badge" style={{ backgroundColor: primaryColor }}>
                {product.highlight}
              </span>
            )}
            {product.price && <span className="product-price">{product.price}</span>}
          </div>
          <p className="product-description">{product.description}</p>
          {product.features.length > 0 && (
            <div className="features-grid">
              {product.features.map((f, j) => (
                <div key={j} className="feature-item">
                  <span className="feature-dot" style={{ backgroundColor: primaryColor }} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Why Choose Us */}
      <div className="page">
        <div className="page-header">
          <h2>Why Choose {brand.name}</h2>
          <div className="header-line" style={{ backgroundColor: primaryColor }} />
        </div>
        <div className="why-grid">
          {catalogue.whyChooseUs.map((reason, i) => (
            <div key={i} className="why-item">
              <span className="why-number" style={{ color: primaryColor }}>{String(i + 1).padStart(2, '0')}</span>
              <p>{reason}</p>
            </div>
          ))}
        </div>
        {catalogue.testimonial && (
          <div className="testimonial" style={{ borderLeftColor: primaryColor }}>
            <p className="testimonial-quote">&ldquo;{catalogue.testimonial.quote}&rdquo;</p>
            <p className="testimonial-author">— {catalogue.testimonial.author}, {catalogue.testimonial.company}</p>
          </div>
        )}
      </div>

      {/* Back Cover */}
      <div className="page back-cover" style={{ backgroundColor: '#f8fafc' }}>
        <div className="back-content">
          <h3 style={{ color: primaryColor }}>{catalogue.contactCta}</h3>
          {brand.websiteUrl && <p className="website-url">{brand.websiteUrl}</p>}
          <p className="footer-text">{catalogue.footerText}</p>
          <div className="back-brand" style={{ borderTopColor: primaryColor }}>
            <span style={{ color: primaryColor }}>{brand.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sales Kit HTML ────────────────────────────────────────────────────────────

function SalesKitExport({ salesKit, brand }: { salesKit: SalesKit; brand: Campaign['brandProfile'] }) {
  const primaryColor = '#1F4E79'

  return (
    <div className="export-doc">
      {/* Cover Slide */}
      <div className="page slide cover-slide" style={{ backgroundColor: primaryColor }}>
        <div className="slide-content centered">
          <p className="slide-label">SALES KIT · CONFIDENTIAL</p>
          <h1 className="slide-title">{brand.name}</h1>
          {brand.tagline && <p className="slide-subtitle">{brand.tagline}</p>}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="page slide">
        <div className="slide-header" style={{ backgroundColor: primaryColor }}>
          <p className="slide-number">01</p>
          <h2>Executive Summary</h2>
        </div>
        <div className="slide-body">
          <p className="summary-text">{salesKit.executiveSummary}</p>
        </div>
      </div>

      {/* Problem / Solution */}
      <div className="page slide two-col">
        <div className="col problem-col">
          <div className="col-header" style={{ backgroundColor: '#dc2626' }}>
            <p className="slide-number">02</p>
            <h2>The Problem</h2>
          </div>
          <p className="col-text">{salesKit.problem}</p>
        </div>
        <div className="col solution-col">
          <div className="col-header" style={{ backgroundColor: '#16a34a' }}>
            <p className="slide-number">03</p>
            <h2>Our Solution</h2>
          </div>
          <p className="col-text">{salesKit.solution}</p>
        </div>
      </div>

      {/* Differentiators */}
      <div className="page slide">
        <div className="slide-header" style={{ backgroundColor: primaryColor }}>
          <p className="slide-number">04</p>
          <h2>Why {brand.name}?</h2>
        </div>
        <div className="slide-body">
          <div className="diff-grid">
            {salesKit.differentiators.map((d, i) => (
              <div key={i} className="diff-item">
                <span className="diff-number" style={{ color: primaryColor }}>{String(i + 1).padStart(2, '0')}</span>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      {salesKit.pricing.length > 0 && (
        <div className="page slide">
          <div className="slide-header" style={{ backgroundColor: primaryColor }}>
            <p className="slide-number">05</p>
            <h2>Pricing</h2>
          </div>
          <div className="slide-body">
            <div className="pricing-grid">
              {salesKit.pricing.map((tier, i) => (
                <div key={i} className="pricing-tier" style={{ borderTopColor: primaryColor }}>
                  <p className="tier-name">{tier.tier}</p>
                  <p className="tier-price" style={{ color: primaryColor }}>{tier.price}</p>
                  <p className="tier-summary">{tier.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Social Proof */}
      <div className="page slide">
        <div className="slide-header" style={{ backgroundColor: primaryColor }}>
          <p className="slide-number">06</p>
          <h2>Results &amp; Trust</h2>
        </div>
        <div className="slide-body">
          <p className="summary-text">{salesKit.socialProof}</p>
        </div>
      </div>

      {/* Slides detail */}
      {salesKit.slides.slice(1).map((slide, i) => (
        <div key={i} className="page slide">
          <div className="slide-header" style={{ backgroundColor: '#374151' }}>
            <p className="slide-number">{String(i + 7).padStart(2, '0')}</p>
            <h2>{slide.title}</h2>
            {slide.stat && (
              <div className="slide-stat">
                <span className="stat-number" style={{ color: primaryColor }}>{slide.stat}</span>
                <span className="stat-label">{slide.statLabel}</span>
              </div>
            )}
          </div>
          <div className="slide-body">
            {slide.content && <p className="col-text mb-4">{slide.content}</p>}
            {slide.bullets && slide.bullets.length > 0 && (
              <ul className="slide-bullets">
                {slide.bullets.map((b, j) => (
                  <li key={j}><span style={{ color: primaryColor }}>→</span> {b}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}

      {/* CTA Slide */}
      <div className="page slide cta-slide" style={{ backgroundColor: primaryColor }}>
        <div className="slide-content centered">
          <p className="slide-label">READY TO GET STARTED?</p>
          <h2 className="cta-text">{salesKit.cta}</h2>
          {brand.websiteUrl && <p className="cta-website">{brand.websiteUrl}</p>}
        </div>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function ExportPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { doc } = await searchParams

  const row = await prisma.campaign.findFirst({
    where: { OR: [{ id }, { shareToken: id }] },
  })
  if (!row) notFound()

  const content = row.content as unknown as CampaignContent | null
  const brand = row.brandProfile as unknown as Campaign['brandProfile']
  const brandName = row.brandName

  const showCatalogue = doc === 'catalogue' || (!doc && content?.catalogue)
  const showSalesKit = doc === 'salesKit' || (!doc && content?.salesKit)

  const catalogue = content?.catalogue as SalesCatalogue | undefined
  const salesKit = content?.salesKit as SalesKit | undefined

  if (!catalogue && !salesKit) {
    return (
      <div style={{ fontFamily: 'system-ui', padding: '2rem', color: '#666' }}>
        <p>Documents not generated yet. Complete the campaign first.</p>
      </div>
    )
  }

  return (
    <div>
      <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #e5e7eb; color: #1e293b; }

          .export-doc { max-width: 860px; margin: 0 auto; }

          /* Print controls */
          .print-bar { background: #1e293b; color: white; padding: 12px 24px; display: flex; align-items: center; justify-between; gap: 12px; position: sticky; top: 0; z-index: 100; }
          .print-bar p { font-size: 13px; opacity: 0.7; flex: 1; }
          .print-btn { background: #1F4E79; color: white; border: none; padding: 8px 20px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; }
          .print-btn:hover { background: #2d6da3; }

          /* Pages */
          .page { background: white; margin: 24px auto; padding: 60px; min-height: 297mm; display: flex; flex-direction: column; position: relative; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
          @media print {
            body { background: white; }
            .print-bar { display: none; }
            .page { margin: 0; padding: 40px; min-height: 100vh; box-shadow: none; page-break-after: always; }
          }

          /* Cover */
          .cover-page { justify-content: center; align-items: flex-start; padding: 80px; }
          .cover-content { color: white; }
          .cover-label { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.7; margin-bottom: 24px; }
          .cover-title { font-size: 48px; font-weight: 800; line-height: 1.1; margin-bottom: 16px; }
          .cover-tagline { font-size: 18px; opacity: 0.85; margin-bottom: 40px; }
          .cover-divider { width: 60px; height: 3px; background: rgba(255,255,255,0.4); margin-bottom: 40px; }
          .cover-brand { font-size: 20px; font-weight: 700; }
          .cover-brand-tagline { font-size: 13px; opacity: 0.65; margin-top: 4px; }

          /* Page headers */
          .page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
          .page-header h2 { font-size: 28px; font-weight: 700; flex: 1; }
          .header-line { height: 3px; width: 48px; }

          /* Product */
          .product-number { color: white; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 4px; }
          .product-badge { color: white; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 12px; }
          .product-price { font-size: 20px; font-weight: 800; color: #16a34a; margin-left: auto; }
          .product-description { font-size: 15px; line-height: 1.7; color: #475569; margin-bottom: 24px; }
          .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .feature-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #374151; }
          .feature-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }

          /* Overview */
          .overview-text { font-size: 16px; line-height: 1.8; color: #374151; }

          /* Why */
          .why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
          .why-item { display: flex; gap: 16px; }
          .why-number { font-size: 28px; font-weight: 800; opacity: 0.15; line-height: 1; flex-shrink: 0; }
          .why-item p { font-size: 14px; line-height: 1.6; color: #374151; padding-top: 6px; }
          .testimonial { border-left: 4px solid; padding: 20px 24px; background: #f8fafc; border-radius: 0 8px 8px 0; }
          .testimonial-quote { font-size: 16px; font-style: italic; color: #334155; line-height: 1.7; margin-bottom: 12px; }
          .testimonial-author { font-size: 13px; color: #64748b; font-weight: 600; }

          /* Back cover */
          .back-cover { justify-content: center; align-items: center; }
          .back-content { text-align: center; }
          .back-content h3 { font-size: 26px; font-weight: 700; margin-bottom: 16px; }
          .website-url { font-size: 15px; color: #64748b; margin-bottom: 8px; }
          .footer-text { font-size: 13px; color: #94a3b8; margin-bottom: 40px; }
          .back-brand { border-top: 2px solid; padding-top: 20px; margin-top: 20px; }
          .back-brand span { font-size: 20px; font-weight: 800; }

          /* Slides */
          .slide { padding: 0; overflow: hidden; }
          .slide-header { color: white; padding: 32px 48px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
          .slide-header h2 { font-size: 26px; font-weight: 700; flex: 1; }
          .slide-number { font-size: 12px; font-weight: 800; letter-spacing: 0.1em; opacity: 0.7; }
          .slide-body { padding: 48px; flex: 1; }
          .slide-content { padding: 80px 60px; flex: 1; display: flex; flex-direction: column; }
          .cover-slide { color: white; justify-content: center; }
          .slide-label { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.6; margin-bottom: 20px; }
          .slide-title { font-size: 52px; font-weight: 800; line-height: 1.1; color: white; margin-bottom: 16px; }
          .slide-subtitle { font-size: 20px; opacity: 0.8; color: white; }
          .centered { justify-content: center; }
          .summary-text { font-size: 17px; line-height: 1.8; color: #374151; }
          .mb-4 { margin-bottom: 16px; }

          /* Two col */
          .two-col { flex-direction: row; padding: 0; }
          .col { flex: 1; display: flex; flex-direction: column; }
          .col-header { color: white; padding: 28px 32px; }
          .col-header h2 { font-size: 22px; font-weight: 700; }
          .col-text { padding: 32px; font-size: 15px; line-height: 1.75; color: #374151; flex: 1; }

          /* Differentiators */
          .diff-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
          .diff-item { display: flex; gap: 16px; }
          .diff-number { font-size: 32px; font-weight: 800; opacity: 0.12; line-height: 1; flex-shrink: 0; }
          .diff-item p { font-size: 14px; line-height: 1.6; color: #374151; padding-top: 8px; }

          /* Pricing */
          .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
          .pricing-tier { border-top: 3px solid; padding: 20px; background: #f8fafc; border-radius: 0 0 8px 8px; }
          .tier-name { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 8px; }
          .tier-price { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
          .tier-summary { font-size: 13px; color: #64748b; line-height: 1.5; }

          /* Slide stat */
          .slide-stat { display: flex; align-items: baseline; gap: 6px; }
          .stat-number { font-size: 32px; font-weight: 800; }
          .stat-label { font-size: 12px; opacity: 0.7; }

          /* Bullets */
          .slide-bullets { list-style: none; space-y: 8px; }
          .slide-bullets li { font-size: 15px; line-height: 1.6; color: #374151; padding: 6px 0; display: flex; gap: 12px; }

          /* CTA slide */
          .cta-slide { justify-content: center; }
          .cta-text { font-size: 32px; font-weight: 700; color: white; margin-bottom: 20px; line-height: 1.3; }
          .cta-website { font-size: 16px; color: rgba(255,255,255,0.7); }
        `}</style>
      <div className="print-bar">
        <p>{brandName} — {doc === 'salesKit' ? 'Sales Kit' : 'Sales Catalogue'}</p>
        <PrintButton label="Export PDF" />
      </div>

      {showCatalogue && catalogue && (
        <CatalogueExport catalogue={catalogue} brand={brand} />
      )}
      {showSalesKit && salesKit && (
        <SalesKitExport salesKit={salesKit} brand={brand} />
      )}
    </div>
  )
}
