import 'server-only'

import type {SubscribePayload} from './newsletter-shared'

const BUTTONDOWN_API = 'https://api.buttondown.com/v1/subscribers'

function getButtondownApiKey() {
  return process.env['BUTTONDOWN_API_KEY']
}

export async function subscribeToNewsletter(payload: SubscribePayload) {
  const {email, consent, source, resourceSlug} = payload

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {ok: false as const, error: 'Please enter a valid email address.'}
  }

  if (!consent) {
    return {ok: false as const, error: 'Please agree to receive email updates.'}
  }

  const apiKey = getButtondownApiKey()
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
