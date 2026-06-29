import type {Metadata} from 'next'
import {SiteHeader} from '@/components/SiteHeader'
import {ResourceCard} from '@/components/ResourceCard'
import {SiteFooter} from '@/components/SiteFooter'
import {getDownloadableResources, getSiteSettings} from '@/sanity/queries'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Downloads',
  description: 'Download trading bots, research papers, and utilities.',
}

export default async function DownloadsPage() {
  const [settings, resources] = await Promise.all([
    getSiteSettings(),
    getDownloadableResources(),
  ])

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            Downloads
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            All downloads
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/50">
            Browse every resource with a connected file or external download link.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                consentText={settings?.newsletter?.consentText}
              />
            ))}
          </div>
          {resources.length === 0 && (
            <p className="mt-8 font-mono text-sm text-white/40">
              No downloads available yet. Add files or URLs in Sanity Studio.
            </p>
          )}
        </div>
      </main>
      <SiteFooter settings={settings} />
    </>
  )
}
