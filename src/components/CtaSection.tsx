import Link from 'next/link'
import type {SiteSettings} from '@/sanity/types'
import {DEFAULT_NEWSLETTER} from '@/lib/newsletter-shared'
import {NewsletterSubscribe} from './NewsletterSubscribe'

type CtaSectionProps = {
  settings: SiteSettings | null
}

export function CtaSection({settings}: CtaSectionProps) {
  const cta = settings?.ctaSection ?? {
    title: 'Get new bots, papers, and tools',
    body: 'Subscribe for updates when we add new EAs, research, and utilities. No daily spam — just the library.',
    primaryLabel: 'Browse library',
    primaryHref: '/',
    secondaryLabel: 'View downloads',
    secondaryHref: '/downloads',
    showNewsletterForm: true,
  }
  const newsletter = settings?.newsletter ?? DEFAULT_NEWSLETTER
  const showForm = cta.showNewsletterForm !== false

  return (
    <section className="px-6 py-20">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-accent/20 bg-white/[0.02] p-10 shadow-[0_0_60px_rgba(34,211,238,0.08)] md:p-16">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl"
          style={{background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)'}}
        />
        <h2 className="relative text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {cta.title}
        </h2>
        <p className="relative mt-4 max-w-2xl text-base leading-relaxed text-white/50">
          {cta.body}
        </p>
        <div className="relative mt-8 flex flex-wrap gap-4">
          <Link
            href={cta.primaryHref}
            className="rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-black transition hover:bg-accent/90"
          >
            {cta.primaryLabel}
          </Link>
          <Link
            href={cta.secondaryHref}
            className="rounded-full border border-accent/40 px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent transition hover:border-accent hover:bg-accent/10"
          >
            {cta.secondaryLabel}
          </Link>
        </div>
        {showForm && (
          <div className="relative mt-10 max-w-lg border-t border-white/10 pt-8">
            <NewsletterSubscribe
              title={newsletter.title}
              description={newsletter.promise}
              consentText={newsletter.consentText}
              source="cta"
              compact
            />
          </div>
        )}
      </div>
    </section>
  )
}
