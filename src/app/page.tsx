import {SiteHeader} from '@/components/SiteHeader'
import {Hero} from '@/components/Hero'
import {LibraryIndex} from '@/components/LibraryIndex'
import {CategorySection} from '@/components/CategorySection'
import {CtaSection} from '@/components/CtaSection'
import {SiteFooter} from '@/components/SiteFooter'
import {
  getCategories,
  getResources,
  getSiteSettings,
} from '@/sanity/queries'

export const revalidate = 60

export default async function HomePage() {
  const [settings, categories, resources] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getResources(),
  ])

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="flex-1">
        <Hero settings={settings} />
        <LibraryIndex
          categories={categories}
          resources={resources}
          indexLabel={settings?.libraryIndexLabel}
          indexStatus={settings?.libraryIndexStatus}
        />
        {categories.map((category) => (
          <CategorySection
            key={category._id}
            category={category}
            resources={resources.filter((r) => r.category?.slug === category.slug)}
          />
        ))}
        <CtaSection settings={settings} />
      </main>
      <SiteFooter settings={settings} />
    </>
  )
}
