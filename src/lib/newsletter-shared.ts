export type NewsletterSource = 'hero' | 'footer' | 'cta' | 'download-gate'

export type SubscribePayload = {
  email: string
  consent: boolean
  source: NewsletterSource
  resourceSlug?: string
}

export const DEFAULT_CONSENT_TEXT =
  'I agree to receive emails about new trading resources and updates from TradeOps Library. I can unsubscribe at any time.'

export const DEFAULT_NEWSLETTER = {
  title: 'Stay updated',
  description: 'New EAs, research, and tools — when we add them.',
  promise: 'No daily spam. Unsubscribe anytime.',
  consentText: DEFAULT_CONSENT_TEXT,
  showInHero: true,
  showInFooter: true,
}

export function downloadUnlockKey(slug: string) {
  return `tradeops_download_${slug}`
}

export function isDownloadUnlocked(slug: string) {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(downloadUnlockKey(slug)) === '1'
}

export function unlockDownload(slug: string) {
  localStorage.setItem(downloadUnlockKey(slug), '1')
}
