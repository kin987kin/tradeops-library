import type {SiteSettings} from '@/sanity/types'

type SiteFooterProps = {
  settings: SiteSettings | null
}

export function SiteFooter({settings}: SiteFooterProps) {
  const footerText = settings?.footerText ?? '© 2026 TradeOps Hub'

  return (
    <footer className="mt-auto border-t border-white/10 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="font-mono text-xs text-white/40">{footerText}</p>
        <div className="flex gap-6">
          <a href="/bots" className="font-mono text-xs uppercase tracking-widest text-white/40 hover:text-white">
            Bots
          </a>
          <a href="/research" className="font-mono text-xs uppercase tracking-widest text-white/40 hover:text-white">
            Research
          </a>
          <a href="/utilities" className="font-mono text-xs uppercase tracking-widest text-white/40 hover:text-white">
            Utilities
          </a>
        </div>
      </div>
    </footer>
  )
}
