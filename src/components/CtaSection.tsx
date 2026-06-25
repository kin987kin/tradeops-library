import Link from 'next/link'
import type {SiteSettings} from '@/sanity/types'

type CtaSectionProps = {
  settings: SiteSettings | null
}

export function CtaSection({settings}: CtaSectionProps) {
  const cta = settings?.ctaSection ?? {
    title: 'Ready to add your real files?',
    body: 'Swap the sample resources for your bots, papers, and utilities, then connect each download button to the correct file or external URL.',
    primaryLabel: 'Browse library',
    primaryHref: '/',
    secondaryLabel: 'Add downloads',
    secondaryHref: '/downloads',
  }

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/[0.02] p-10 md:p-16">
        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {cta.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/50">{cta.body}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={cta.primaryHref}
            className="rounded-full bg-white px-6 py-3 font-mono text-xs uppercase tracking-widest text-black transition hover:bg-white/90"
          >
            {cta.primaryLabel}
          </Link>
          <Link
            href={cta.secondaryHref}
            className="rounded-full border border-white/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-white transition hover:border-white/50"
          >
            {cta.secondaryLabel}
          </Link>
        </div>
        <p className="mt-6 font-mono text-xs text-white/30">
          Download buttons are placeholders until real files or external URLs are connected.
        </p>
      </div>
    </section>
  )
}
