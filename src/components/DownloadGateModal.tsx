'use client'

import {useEffect} from 'react'
import {NewsletterSubscribe} from './NewsletterSubscribe'
import {DEFAULT_CONSENT_TEXT} from '@/lib/newsletter-shared'

type DownloadGateModalProps = {
  resourceTitle: string
  consentText?: string
  resourceSlug: string
  onClose: () => void
  onUnlock: () => void
}

export function DownloadGateModal({
  resourceTitle,
  consentText = DEFAULT_CONSENT_TEXT,
  resourceSlug,
  onClose,
  onUnlock,
}: DownloadGateModalProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-gate-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-accent/20 bg-[#0f0f0f] p-6 shadow-[0_0_40px_rgba(34,211,238,0.12)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 font-mono text-xs text-white/40 transition hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>

        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70">
          Download access
        </p>
        <h2 id="download-gate-title" className="mt-2 text-xl font-semibold text-white">
          {resourceTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/50">
          Enter your email to download this resource and get notified when we add new bots and tools.
        </p>

        <NewsletterSubscribe
          source="download-gate"
          resourceSlug={resourceSlug}
          consentText={consentText}
          compact
          className="mt-5"
          onSuccess={onUnlock}
        />
      </div>
    </div>
  )
}
