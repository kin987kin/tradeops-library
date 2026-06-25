import Link from 'next/link'

type ResourceNavProps = {
  prev?: {title: string; slug: string} | null
  next?: {title: string; slug: string} | null
}

export function ResourceNav({prev, next}: ResourceNavProps) {
  if (!prev && !next) return null

  return (
    <nav className="mt-16 flex items-center justify-between gap-4 border-t border-white/10 pt-8">
      {prev ? (
        <Link
          href={`/resource-library/${prev.slug}`}
          className="group max-w-[45%] font-mono text-sm text-white/50 transition hover:text-white"
        >
          <span className="block text-xs uppercase tracking-widest text-white/30">Previous</span>
          <span className="mt-1 block">‹ {prev.title}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/resource-library/${next.slug}`}
          className="group max-w-[45%] text-right font-mono text-sm text-white/50 transition hover:text-white"
        >
          <span className="block text-xs uppercase tracking-widest text-white/30">Next</span>
          <span className="mt-1 block">{next.title} ›</span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
