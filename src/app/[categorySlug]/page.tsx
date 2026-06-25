import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import {SiteHeader} from '@/components/SiteHeader'
import {ResourceCard} from '@/components/ResourceCard'
import {SiteFooter} from '@/components/SiteFooter'
import {
  getCategoryBySlug,
  getResourcesByCategory,
  getSiteSettings,
  isCategorySlug,
} from '@/sanity/queries'

export const revalidate = 60

type Props = {
  params: Promise<{categorySlug: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {categorySlug} = await params
  if (!isCategorySlug(categorySlug)) return {title: 'Not Found'}
  const category = await getCategoryBySlug(categorySlug)
  return {title: category?.title ?? 'Category'}
}

export default async function CategoryPage({params}: Props) {
  const {categorySlug} = await params

  if (!isCategorySlug(categorySlug)) {
    notFound()
  }

  const [settings, category, resources] = await Promise.all([
    getSiteSettings(),
    getCategoryBySlug(categorySlug),
    getResourcesByCategory(categorySlug),
  ])

  if (!category) {
    notFound()
  }

  const title = category.sectionTitle ?? category.title
  const description = category.pageIntro ?? category.sectionDescription

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            {category.title}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/50">
              {description}
            </p>
          )}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
          {resources.length === 0 && (
            <p className="mt-8 font-mono text-sm text-white/40">
              No resources in this category yet. Add them in Sanity Studio.
            </p>
          )}
        </div>
      </main>
      <SiteFooter settings={settings} />
    </>
  )
}
