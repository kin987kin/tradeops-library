import type {SiteSettings} from '@/sanity/types'

const defaultDisclaimer =
  'Trading involves substantial risk and is not suitable for every investor. Past performance is not indicative of future results. Resources on this site are provided for educational and research purposes only and do not constitute financial advice.'

type DisclaimerBannerProps = {
  settings: SiteSettings | null
}

export function DisclaimerBanner({settings}: DisclaimerBannerProps) {
  const text = settings?.disclaimerText ?? defaultDisclaimer

  if (!text) return null

  return (
    <div className="border-t border-accent/20 bg-accent-dim px-6 py-4">
      <p className="mx-auto max-w-6xl font-mono text-[11px] leading-relaxed text-white/45">
        {text}
      </p>
    </div>
  )
}
