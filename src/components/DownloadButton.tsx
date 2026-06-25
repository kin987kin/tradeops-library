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
      className={`inline-flex w-full items-center justify-center rounded-full border border-white/20 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-white transition hover:border-white/50 hover:bg-white/5 ${className}`}
      onClick={isPlaceholder ? (e) => e.preventDefault() : undefined}
      aria-disabled={isPlaceholder}
    >
      {label}
    </a>
  )
}
