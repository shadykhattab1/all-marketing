'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, Palette, Search, FileText, Megaphone, Mail,
  Calendar, Swords, BarChart3, Presentation, Video, Globe,
  PenTool, Package, Zap, Download, ImageIcon,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type OutputCard = { icon: React.ElementType; label: string; badge?: string };

// ── Data ──────────────────────────────────────────────────────────────────────

const OUTPUT_CARDS: OutputCard[] = [
  { icon: Palette,      label: 'Brand Kit',           badge: 'NEW' },
  { icon: Search,       label: 'SEO Strategy' },
  { icon: Globe,        label: 'AEO Content' },
  { icon: FileText,     label: 'Blog Post' },
  { icon: Megaphone,    label: 'Ad Copy' },
  { icon: Mail,         label: 'Email Sequence',       badge: 'HOT' },
  { icon: ImageIcon,    label: 'Social Content' },
  { icon: PenTool,      label: 'Website Copy' },
  { icon: Calendar,     label: 'Content Calendar' },
  { icon: Swords,       label: 'Competitor Analysis' },
  { icon: Video,        label: '3 Video Reels',        badge: 'AI' },
  { icon: Presentation, label: 'PPTX Sales Deck' },
  { icon: Package,      label: 'PDF Catalog' },
];

const STEPS = [
  {
    n: '01',
    icon: Globe,
    title: 'Drop a URL',
    desc: 'We extract your brand identity, tone, colors, and messaging automatically — no manual setup.',
  },
  {
    n: '02',
    icon: Zap,
    title: 'Watch it generate',
    desc: '13 content types + 3 video reels, all running in parallel. Done in under 60 seconds.',
  },
  {
    n: '03',
    icon: Download,
    title: 'Download everything',
    desc: 'Brand kit, blog, ads, social, email sequences, reels — all yours, instantly.',
  },
];

// ── URL Input Component ───────────────────────────────────────────────────────

function UrlInput({ size = 'hero' }: { size?: 'hero' | 'cta' }) {
  const router = useRouter();
  const [url, setUrl] = useState('');

  function handleChange(v: string) {
    setUrl(v);
    if (typeof window !== 'undefined') localStorage.setItem('pending_url', v);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    router.push(`/create?url=${encodeURIComponent(url.trim())}`);
  }

  const isHero = size === 'hero';

  return (
    <div className={isHero ? 'w-full max-w-2xl' : 'w-full max-w-xl'}>
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="url"
          value={url}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="https://your-business.com"
          className={`w-full bg-white/[0.06] border border-white/[0.12] rounded-2xl text-white placeholder-white/30 transition-all
            focus:border-[var(--vk-accent)] focus:bg-white/[0.09]
            ${isHero ? 'text-base px-6 py-5 pr-44' : 'text-sm px-5 py-4 pr-40'}`}
          style={{ backdropFilter: 'blur(12px)' }}
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 -translate-y-1/2 font-semibold text-white rounded-xl flex items-center gap-2 transition-all
            hover:brightness-110 active:scale-[0.97]
            ${isHero ? 'px-5 py-3 text-sm' : 'px-4 py-2.5 text-xs'}`}
          style={{ background: 'linear-gradient(135deg, #0F766E, #0891B2)' }}
        >
          Generate Campaign
          <ArrowRight className={isHero ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        </button>
      </form>
      <div className="flex items-center gap-4 mt-3 pl-1">
        <Link href="/create?mode=photo" className="text-xs text-white/40 hover:text-white/70 transition-colors underline underline-offset-2">
          or upload a photo
        </Link>
        <span className="text-white/20 text-xs">·</span>
        <Link href="/create?mode=manual" className="text-xs text-white/40 hover:text-white/70 transition-colors underline underline-offset-2">
          enter manually
        </Link>
      </div>
    </div>
  );
}

// ── Scroll reveal hook ────────────────────────────────────────────────────────

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  useReveal();
  const orb1 = useRef<HTMLDivElement>(null);
  const orb2 = useRef<HTMLDivElement>(null);

  // Parallax orbs on mouse move
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      if (orb1.current) orb1.current.style.transform = `translate(${x * -30}px, ${y * -20}px)`;
      if (orb2.current) orb2.current.style.transform = `translate(${x * 24}px, ${y * 18}px)`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <style>{`
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes gradSweep { 0%{background-position:0%} 100%{background-position:300%} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,-12px) scale(1.04)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(14px,10px) scale(0.96)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        .reveal { opacity:0; transform:translateY(22px); transition:opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
        .reveal.on { opacity:1; transform:none; }
        [data-d="1"]{transition-delay:.08s!important}
        [data-d="2"]{transition-delay:.16s!important}
        [data-d="3"]{transition-delay:.24s!important}
        [data-d="4"]{transition-delay:.32s!important}
        [data-d="5"]{transition-delay:.40s!important}
        [data-d="6"]{transition-delay:.48s!important}
        .hero-fade-1 { animation: fadeUp .9s cubic-bezier(.16,1,.3,1) both; animation-delay: .1s; }
        .hero-fade-2 { animation: fadeUp .9s cubic-bezier(.16,1,.3,1) both; animation-delay: .22s; }
        .hero-fade-3 { animation: fadeUp .9s cubic-bezier(.16,1,.3,1) both; animation-delay: .34s; }
        .hero-fade-4 { animation: fadeUp .9s cubic-bezier(.16,1,.3,1) both; animation-delay: .48s; }
        .hero-fade-5 { animation: fadeUp .9s cubic-bezier(.16,1,.3,1) both; animation-delay: .62s; }
        .grad-text {
          background: linear-gradient(90deg, #38BDF8 0%, #34D399 35%, #60A5FA 65%, #38BDF8 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradSweep 6s linear infinite;
        }
        .output-card { transition: border-color .2s, background .2s, transform .2s; }
        .output-card:hover { border-color: rgba(52,211,153,.4) !important; background: rgba(52,211,153,.06) !important; transform: translateY(-2px); }
        .step-card { transition: border-color .2s, box-shadow .2s; }
        .step-card:hover { border-color: rgba(56,189,248,.25) !important; box-shadow: 0 8px 40px rgba(56,189,248,.06); }
        .scanline-anim { animation: scanline 8s linear infinite; opacity: 0.025; }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20"
        style={{ background: '#0A0A0B' }}>

        {/* Atmospheric orbs */}
        <div ref={orb1} className="absolute pointer-events-none"
          style={{ top: '8%', left: '12%', width: 640, height: 640,
            background: 'radial-gradient(circle, rgba(15,118,110,.18) 0%, transparent 65%)',
            animation: 'orb1 12s ease-in-out infinite', willChange: 'transform' }} />
        <div ref={orb2} className="absolute pointer-events-none"
          style={{ bottom: '10%', right: '8%', width: 560, height: 560,
            background: 'radial-gradient(circle, rgba(56,189,248,.13) 0%, transparent 65%)',
            animation: 'orb2 10s ease-in-out infinite', willChange: 'transform' }} />

        {/* Subtle dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

        {/* Scanline effect */}
        <div className="scanline-anim absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,.08) 50%, transparent 100%)', height: '120px' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full">

          {/* Badge */}
          <div className="hero-fade-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide mb-8"
            style={{ background: 'rgba(15,118,110,.12)', borderColor: 'rgba(15,118,110,.3)', color: '#34D399' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            13 AI generators · Video reels · No signup required
          </div>

          {/* Headline */}
          <h1 className="hero-fade-2 font-black tracking-tight mb-5 text-white"
            style={{ fontSize: 'clamp(42px, 7vw, 88px)', lineHeight: 1.0, letterSpacing: '-0.04em' }}>
            One URL.{' '}
            <span className="grad-text">Complete</span>
            <br />Campaign.
          </h1>

          {/* Sub */}
          <p className="hero-fade-3 text-white/50 mb-10 leading-relaxed"
            style={{ fontSize: 'clamp(16px, 2vw, 20px)', maxWidth: 580 }}>
            Drop any URL. Get 13 marketing assets + 3 branded video reels in 60&nbsp;seconds.
            <span className="text-white/30"> No signup.</span>
          </p>

          {/* URL Input */}
          <div className="hero-fade-4 w-full flex justify-center mb-8">
            <UrlInput size="hero" />
          </div>

          {/* Social proof strip */}
          <div className="hero-fade-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/30 font-medium">
            {['13 AI generators', 'Video reels', 'SEO + ads + email', 'Zero friction'].map((t, i) => (
              <span key={t} className="flex items-center gap-1.5">
                {i > 0 && <span className="hidden sm:inline text-white/15">·</span>}
                <span className="w-1 h-1 rounded-full bg-emerald-500/60" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#0D0D0E' }}>
        <div className="max-w-5xl mx-auto">
          <div className="reveal text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#34D399' }}>How it works</p>
            <h2 className="font-black text-white tracking-tight"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.03em' }}>
              Three steps.<br />Everything done.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map((step, i) => (
              <div key={step.n}
                className="step-card reveal p-8 rounded-2xl border"
                data-d={`${i + 1}`}
                style={{ background: 'rgba(255,255,255,.03)', borderColor: 'rgba(255,255,255,.07)' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(15,118,110,.15)', border: '1px solid rgba(15,118,110,.25)' }}>
                    <step.icon className="w-5 h-5" style={{ color: '#34D399' }} />
                  </div>
                  <span className="text-4xl font-black" style={{ color: 'rgba(255,255,255,.08)', letterSpacing: '-2px' }}>{step.n}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2" style={{ letterSpacing: '-0.02em' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,.38)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#0A0A0B' }}>
        <div className="max-w-5xl mx-auto">
          <div className="reveal text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#38BDF8' }}>What you get</p>
            <h2 className="font-black text-white tracking-tight"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.03em' }}>
              13 assets. 60 seconds.
            </h2>
            <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,.35)', maxWidth: 480, margin: '16px auto 0' }}>
              Every output your marketing team would build in a month — generated in one run.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {OUTPUT_CARDS.map((card, i) => (
              <div key={card.label}
                className="output-card reveal relative p-5 rounded-xl border cursor-default"
                data-d={`${(i % 4) + 1}`}
                style={{ background: 'rgba(255,255,255,.025)', borderColor: 'rgba(255,255,255,.06)' }}>
                {card.badge && (
                  <span className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: card.badge === 'AI' ? 'rgba(56,189,248,.15)' : 'rgba(52,211,153,.12)',
                      color: card.badge === 'AI' ? '#38BDF8' : '#34D399' }}>
                    {card.badge}
                  </span>
                )}
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <card.icon className="w-4 h-4" style={{ color: 'rgba(255,255,255,.5)' }} />
                </div>
                <p className="text-sm font-semibold text-white/80">{card.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ───────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ background: '#0D0D0E' }}>
        {/* Glow behind CTA */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ width: 700, height: 400,
            background: 'radial-gradient(ellipse, rgba(15,118,110,.12) 0%, transparent 65%)',
            filter: 'blur(40px)' }} />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="reveal mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold"
            style={{ background: 'rgba(56,189,248,.08)', borderColor: 'rgba(56,189,248,.2)', color: '#38BDF8' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            No account needed
          </div>
          <h2 className="reveal font-black text-white mb-4 tracking-tight"
            data-d="1"
            style={{ fontSize: 'clamp(28px, 4.5vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.035em' }}>
            Start your first campaign —<br />
            <span className="grad-text">no account needed.</span>
          </h2>
          <p className="reveal text-white/40 mb-10 text-base leading-relaxed" data-d="2" style={{ maxWidth: 480 }}>
            Paste your URL and get back a complete campaign kit in under a minute.
          </p>
          <div className="reveal w-full flex justify-center" data-d="3">
            <UrlInput size="cta" />
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="px-6 py-12" style={{ background: '#080809', borderTop: '1px solid rgba(255,255,255,.05)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-white/80 text-sm">All Marketing</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,.25)' }}>
              Part of the{' '}
              <a href="https://valkyn.ai" className="hover:text-white/50 transition-colors underline underline-offset-2">Valkyn AI</a>
              {' '}portfolio
            </p>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,.2)' }}>
            © {new Date().getFullYear()} Valkyn AI. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
