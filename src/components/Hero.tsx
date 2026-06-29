import Link from 'next/link'
import Image from 'next/image'
import type {Category, Resource, SiteSettings} from '@/sanity/types'
import {urlFor} from '@/sanity/image'
import {DEFAULT_NEWSLETTER} from '@/lib/newsletter'
import {LibraryIndexChart} from './LibraryIndexChart'
import {NewsletterSubscribe} from './NewsletterSubscribe'

type HeroProps = {
  settings: SiteSettings | null
  categories: Category[]
  resources: Resource[]
}

export function Hero({settings, categories, resources}: HeroProps) {
  const title =
    settings?.heroTitle ?? 'A trading resource library for bots, papers, and utilities'
  const subtitle =
    settings?.heroSubtitle ??
    'Browse a curated library of trading bots, research papers, and practical utilities.'
  const primary = settings?.heroPrimaryCta ?? {label: 'Browse library', href: '/'}
  const secondary = settings?.heroSecondaryCta ?? {label: 'View papers', href: '/research'}
  const newsletter = settings?.newsletter ?? DEFAULT_NEWSLETTER
  const showNewsletter = newsletter.showInHero !== false

  return (
    <section className="relative overflow-hidden border-b border-white/10 px-6 py-16 md:py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at center, var(--accent-glow), transparent 70%)',
        }}
      />
      {settings?.heroImage && (
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <Image
            src={urlFor(settings.heroImage).width(1600).height(900).url()}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]" />
        </div>
      )}
      <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-accent/70">
            Bots • research papers • utilities
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">{subtitle}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={primary.href}
              className="rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-black transition hover:bg-accent/90"
            >
              {primary.label}
            </Link>
            <Link
              href={secondary.href}
              className="rounded-full border border-accent/40 px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent transition hover:border-accent hover:bg-accent/10"
            >
              {secondary.label}
            </Link>
          </div>
          {showNewsletter && (
            <div className="mt-10 max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <NewsletterSubscribe
                title={newsletter.title}
                description={newsletter.description}
                promise={newsletter.promise}
                consentText={newsletter.consentText}
                source="hero"
              />
            </div>
          )}
        </div>
        <LibraryIndexChart
          categories={categories}
          resources={resources}
          indexLabel={settings?.libraryIndexLabel}
          indexStatus={settings?.libraryIndexStatus}
        />
      </div>
    </section>
  )
}
