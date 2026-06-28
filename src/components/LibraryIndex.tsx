import type {Category, Resource} from '@/sanity/types'

type LibraryIndexProps = {
  categories: Category[]
  resources: Resource[]
}

export function LibraryIndex({categories, resources}: LibraryIndexProps) {
  const counts = categories.map((cat) => ({
    ...cat,
    count: resources.filter((r) => r.category?.slug === cat.slug).length,
    unit: cat.slug === 'bots' ? 'FILES' : cat.slug === 'research' ? 'PDFS' : 'TOOLS',
    label:
      cat.slug === 'bots'
        ? 'Bot resources'
        : cat.slug === 'research'
          ? 'Research papers'
          : 'Utilities',
  }))

  return (
    <section className="border-b border-white/10 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-4 sm:grid-cols-3">
          {counts.map((cat) => (
            <div
              key={cat._id}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-accent/25"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                {cat.label}
              </p>
              <p className="mt-2 text-3xl font-semibold text-accent">
                {String(cat.count).padStart(2, '0')}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/35">
                {cat.unit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
