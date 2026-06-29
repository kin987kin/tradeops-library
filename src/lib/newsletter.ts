export type NewsletterSource = 'hero' | 'footer' | 'cta' | 'download-gate'

export type SubscribePayload = {
  email: string
  consent: boolean
  source: NewsletterSource
  resourceSlug?: string
}

export const DEFAULT_CONSENT_TEXT =
  'I agree to receive emails about new trading resources and updates from TradeOps. I can unsubscribe at any time.'

export const DEFAULT_NEWSLETTER = {
  title: 'Stay updated',
  description: 'New EAs, research, and tools — when we add them.',
  promise: 'No daily spam. Unsubscribe anytime.',
  consentText: DEFAULT_CONSENT_TEXT,
  showInHero: true,
  showInFooter: true,
}

const BUTTONDOWN_API = 'https://api.buttondown.com/v1/subscribers'

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

export async function subscribeToNewsletter(payload: SubscribePayload) {
  const {email, consent, source, resourceSlug} = payload

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {ok: false as const, error: 'Please enter a valid email address.'}
  }

  if (!consent) {
    return {ok: false as const, error: 'Please agree to receive email updates.'}
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY
  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[newsletter] Dev mode — no BUTTONDOWN_API_KEY:', {email, source, resourceSlug})
      return {ok: true as const}
    }
    return {
      ok: false as const,
      error: 'Newsletter signup is not configured yet. Please try again later.',
    }
  }

  const tags = [`source:${source}`]
  if (resourceSlug) {
    tags.push(`download:${resourceSlug}`)
  }

  const response = await fetch(BUTTONDOWN_API, {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: email,
      tags,
      metadata: {
        source,
        resourceSlug: resourceSlug ?? null,
        consentAt: new Date().toISOString(),
      },
    }),
  })

  if (response.ok) {
    return {ok: true as const}
  }

  const body = (await response.json().catch(() => null)) as {detail?: string} | null
  const detail = body?.detail ?? ''

  if (response.status === 409 || detail.toLowerCase().includes('already')) {
    return {ok: true as const}
  }

  console.error('[newsletter] Buttondown error:', response.status, detail)
  return {ok: false as const, error: 'Could not subscribe right now. Please try again.'}
}
