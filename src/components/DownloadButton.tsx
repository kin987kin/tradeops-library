'use client'

import {useState} from 'react'
import type {Resource} from '@/sanity/types'
import {DownloadGateModal} from './DownloadGateModal'
import {DEFAULT_CONSENT_TEXT, isDownloadUnlocked, unlockDownload} from '@/lib/newsletter-shared'

type DownloadButtonProps = {
  resource: Resource
  consentText?: string
  className?: string
}

export function DownloadButton({
  resource,
  consentText = DEFAULT_CONSENT_TEXT,
  className = '',
}: DownloadButtonProps) {
  const [showGate, setShowGate] = useState(false)

  const label = resource.downloadLabel ?? 'Download'
  const href = resource.downloadFile?.asset?.url ?? resource.downloadUrl ?? '#'
  const isPlaceholder = href === '#'
  const isGated = resource.downloadGate === 'email' && !isPlaceholder

  function openDownload() {
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  function handleClick(e: React.MouseEvent) {
    if (isPlaceholder) {
      e.preventDefault()
      return
    }

    if (!isGated) {
      return
    }

    e.preventDefault()

    if (isDownloadUnlocked(resource.slug)) {
      openDownload()
      return
    }

    setShowGate(true)
  }

  function handleUnlock() {
    unlockDownload(resource.slug)
    setShowGate(false)
    openDownload()
  }

  return (
    <>
      <a
        href={href}
        target={isPlaceholder || isGated ? undefined : '_blank'}
        rel={isPlaceholder || isGated ? undefined : 'noopener noreferrer'}
        className={`inline-flex items-center font-mono text-xs uppercase tracking-widest text-accent transition hover:text-accent/80 ${className}`}
        onClick={handleClick}
        aria-disabled={isPlaceholder}
      >
        {label} →
      </a>

      {showGate && (
        <DownloadGateModal
          resourceTitle={resource.title}
          resourceSlug={resource.slug}
          consentText={consentText}
          onClose={() => setShowGate(false)}
          onUnlock={handleUnlock}
        />
      )}
    </>
  )
}
