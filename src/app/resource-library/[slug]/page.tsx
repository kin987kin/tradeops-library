import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import {SiteHeader} from '@/components/SiteHeader'
import {DownloadButton} from '@/components/DownloadButton'
import {PortableTextRenderer} from '@/components/PortableTextRenderer'
import {ResourceNav} from '@/components/ResourceNav'
import {SiteFooter} from '@/components/SiteFooter'
import {urlFor} from '@/sanity/image'
import {getResourceBySlug, getSiteSettings} from '@/sanity/queries'

export const revalidate = 60

type Props = {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const resource = await getResourceBySlug(slug)
  return {
    title: resource?.title ?? 'Resource',
    description: resource?.shortDescription,
  }
}

export default async function ResourceDetailPage({params}: Props) {
  const {slug} = await params
  const [settings, resource] = await Promise.all([
    getSiteSettings(),
    getResourceBySlug(slug),
  ])

  if (!resource) {
    notFound()
  }

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="flex-1 px-6 py-16">
        <article className="mx-auto max-w-3xl">
          <Link
            href={resource.category ? `/${resource.category.slug}` : '/'}
            className="mb-8 inline-block font-mono text-xs uppercase tracking-widest text-white/40 transition hover:text-accent"
          >
            ← Back to {resource.category?.title ?? 'library'}
          </Link>

          {resource.image && (
            <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={urlFor(resource.image).width(1200).height(675).url()}
                alt={resource.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <span className="inline-flex rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
            {resource.resourceType}
          </span>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {resource.title}
          </h1>

          <div className="mt-6 max-w-xs">
            <DownloadButton
              resource={resource}
              consentText={settings?.newsletter?.consentText}
            />
          </div>

          <p className="mt-8 text-lg leading-relaxed text-white/60">
            {resource.shortDescription}
          </p>

          {resource.body && resource.body.length > 0 && (
            <div className="mt-10 border-t border-white/10 pt-10">
              <PortableTextRenderer value={resource.body} />
            </div>
          )}

          <ResourceNav prev={resource.prev} next={resource.next} />
        </article>
      </main>
      <SiteFooter settings={settings} />
    </>
  )
}
