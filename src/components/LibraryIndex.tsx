import type {Category, Resource} from '@/sanity/types'

type LibraryIndexProps = {
  categories: Category[]
  resources: Resource[]
  indexLabel?: string
  indexStatus?: string
}

export function LibraryIndex({
  categories,
  resources,
  indexLabel = 'LIBRARY INDEX',
  indexStatus = 'LIVE',
}: LibraryIndexProps) {
  const counts = categories.map((cat) => ({
    ...cat,
    count: resources.filter((r) => r.category?.slug === cat.slug).length,
  }))

  return (
    <section className="border-b border-white/10 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            {indexLabel}
          </span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-emerald-400">
            {indexStatus}
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {counts.map((cat) => (
            <div
              key={cat._id}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-white/40">
                {cat.title}
              </p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {String(cat.count).padStart(2, '0')}
              </p>
              <p className="mt-1 font-mono text-xs text-white/40">
                {cat.slug === 'bots' ? 'FILES' : cat.slug === 'research' ? 'PDFS' : 'TOOLS'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
