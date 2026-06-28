import {DisclaimerBanner} from './DisclaimerBanner'
import type {SiteSettings} from '@/sanity/types'

type SiteFooterProps = {
  settings: SiteSettings | null
}

export function SiteFooter({settings}: SiteFooterProps) {
  const footerText = settings?.footerText ?? '© 2026 TradeOps Hub'
  const disclaimer = settings?.disclaimerText

  return (
    <footer className="mt-auto border-t border-white/10">
      <DisclaimerBanner settings={settings} />
      <div className="px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
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
