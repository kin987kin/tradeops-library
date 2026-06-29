'use client'

import {useState} from 'react'
import type {NewsletterSource} from '@/lib/newsletter'
import {DEFAULT_CONSENT_TEXT} from '@/lib/newsletter'

type NewsletterSubscribeProps = {
  title?: string
  description?: string
  promise?: string
  consentText?: string
  source: NewsletterSource
  resourceSlug?: string
  compact?: boolean
  onSuccess?: () => void
  className?: string
}

export function NewsletterSubscribe({
  title,
  description,
  promise,
  consentText = DEFAULT_CONSENT_TEXT,
  source,
  resourceSlug,
  compact = false,
  onSuccess,
  className = '',
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, consent, source, resourceSlug}),
      })

      const data = (await response.json()) as {error?: string}

      if (!response.ok) {
        setStatus('error')
        setErrorMessage(data.error ?? 'Something went wrong.')
        return
      }

      setStatus('success')
      setEmail('')
      setConsent(false)
      onSuccess?.()
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  if (status === 'success' && !onSuccess) {
    return (
      <div className={`rounded-2xl border border-accent/30 bg-accent/5 p-6 ${className}`}>
        <p className="font-mono text-sm text-accent">You&apos;re subscribed. Check your inbox to confirm.</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {!compact && title && (
        <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-accent/70">{title}</h3>
      )}
      {!compact && description && (
        <p className="mt-2 text-sm leading-relaxed text-white/50">{description}</p>
      )}
      {promise && !compact && (
        <p className="mt-1 font-mono text-[10px] text-white/30">{promise}</p>
      )}

      <form onSubmit={handleSubmit} className={compact ? 'flex flex-col gap-3' : 'mt-4 space-y-3'}>
        <div className={compact ? 'flex flex-col gap-2 sm:flex-row' : 'space-y-3'}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className={`w-full rounded-full border border-white/15 bg-white/5 px-4 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 ${
              compact ? 'sm:flex-1' : ''
            }`}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`rounded-full bg-accent px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-black transition hover:bg-accent/90 disabled:opacity-60 ${
              compact ? 'sm:shrink-0' : 'w-full sm:w-auto'
            }`}
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </div>

        <label className="flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            className="mt-0.5 accent-accent"
          />
          <span className="text-xs leading-relaxed text-white/40">{consentText}</span>
        </label>

        {status === 'error' && errorMessage && (
          <p className="font-mono text-xs text-red-400">{errorMessage}</p>
        )}
      </form>
    </div>
  )
}
