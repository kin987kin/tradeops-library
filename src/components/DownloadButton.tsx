'use client'

import type {Resource} from '@/sanity/types'

type DownloadButtonProps = {
  resource: Resource
  className?: string
}

export function DownloadButton({resource, className = ''}: DownloadButtonProps) {
  const label = resource.downloadLabel ?? 'Download'
  const href = resource.downloadFile?.asset?.url ?? resource.downloadUrl ?? '#'
  const isPlaceholder = href === '#'

  return (
    <a
      href={href}
      target={isPlaceholder ? undefined : '_blank'}
      rel={isPlaceholder ? undefined : 'noopener noreferrer'}
      className={`inline-flex items-center font-mono text-xs uppercase tracking-widest text-accent transition hover:text-accent/80 ${className}`}
      onClick={isPlaceholder ? (e) => e.preventDefault() : undefined}
      aria-disabled={isPlaceholder}
    >
      {label} →
    </a>
  )
}
