import {DisclaimerBanner} from './DisclaimerBanner'
import {NewsletterSubscribe} from './NewsletterSubscribe'
import type {SiteSettings} from '@/sanity/types'
import {DEFAULT_NEWSLETTER} from '@/lib/newsletter-shared'

type SiteFooterProps = {
  settings: SiteSettings | null
}

export function SiteFooter({settings}: SiteFooterProps) {
  const footerText = settings?.footerText ?? '© 2026 TradeOps'
  const disclaimer = settings?.disclaimerText
  const newsletter = settings?.newsletter ?? DEFAULT_NEWSLETTER
  const showNewsletter = newsletter.showInFooter !== false

  return (
    <footer className="mt-auto border-t border-white/10">
      <DisclaimerBanner settings={settings} />
      <div className="px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          {showNewsletter && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <NewsletterSubscribe
                title={newsletter.title}
                description={newsletter.description}
                promise={newsletter.promise}
                consentText={newsletter.consentText}
                source="footer"
                compact
              />
            </div>
          )}
          {disclaimer && (
            <p className="font-mono text-[10px] leading-relaxed text-white/30">{disclaimer}</p>
          )}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="font-mono text-xs text-white/40">{footerText}</p>
            <div className="flex gap-6">
              <a
                href="/bots"
                className="font-mono text-xs uppercase tracking-widest text-white/40 transition hover:text-accent"
              >
                Bots
              </a>
              <a
                href="/research"
                className="font-mono text-xs uppercase tracking-widest text-white/40 transition hover:text-accent"
              >
                Research
              </a>
              <a
                href="/utilities"
                className="font-mono text-xs uppercase tracking-widest text-white/40 transition hover:text-accent"
              >
                Utilities
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
