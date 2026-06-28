import type {Category, Resource} from '@/sanity/types'

type LibraryIndexChartProps = {
  categories: Category[]
  resources: Resource[]
  indexLabel?: string
  indexStatus?: string
}

const barHeights = [42, 68, 55, 82, 48, 72, 60, 88, 52, 76]

export function LibraryIndexChart({
  categories,
  resources,
  indexLabel = 'LIBRARY INDEX',
  indexStatus = 'LIVE',
}: LibraryIndexChartProps) {
  const counts = categories.map((cat) => ({
    ...cat,
    count: resources.filter((r) => r.category?.slug === cat.slug).length,
  }))

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl opacity-60 blur-2xl"
        style={{background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)'}}
      />
      <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-[#0d1117]/90 p-6 shadow-[0_0_40px_rgba(34,211,238,0.12)]">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">
            {indexLabel}
          </span>
          <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
            {indexStatus}
          </span>
        </div>

        <svg
          viewBox="0 0 320 120"
          className="h-28 w-full"
          aria-hidden="true"
          role="img"
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {barHeights.map((h, i) => {
            const x = 12 + i * 30
            const barH = h
            const y = 110 - barH
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={18}
                height={barH}
                rx={3}
                fill="url(#barGradient)"
                opacity={0.5 + (i % 3) * 0.15}
              />
            )
          })}
          <line x1="8" y1="110" x2="312" y2="110" stroke="rgba(34,211,238,0.2)" strokeWidth="1" />
        </svg>

        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
          {counts.map((cat) => (
            <div key={cat._id}>
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                {cat.title}
              </p>
              <p className="mt-1 font-mono text-lg font-semibold text-accent">
                {String(cat.count).padStart(2, '0')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
