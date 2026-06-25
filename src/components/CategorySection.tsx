import Image from 'next/image'
import Link from 'next/link'
import type {Category, Resource} from '@/sanity/types'
import {urlFor} from '@/sanity/image'
import {ResourceCard} from './ResourceCard'

type CategorySectionProps = {
  category: Category
  resources: Resource[]
}

export function CategorySection({category, resources}: CategorySectionProps) {
  const sectionTitle = category.sectionTitle ?? category.title
  const sectionDescription = category.sectionDescription ?? category.pageIntro

  return (
    <section className="border-b border-white/10 px-6 py-16" id={category.slug}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-white/40">
              {category.title}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {sectionTitle}
            </h2>
            {sectionDescription && (
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/50">
                {sectionDescription}
              </p>
            )}
          </div>
          {category.sectionImage && (
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={urlFor(category.sectionImage).width(800).height(450).url()}
                alt={sectionTitle}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </div>
        <div className="mt-8">
          <Link
            href={`/${category.slug}`}
            className="font-mono text-xs uppercase tracking-widest text-white/40 transition hover:text-white"
          >
            View all {category.title.toLowerCase()} →
          </Link>
        </div>
      </div>
    </section>
  )
}
