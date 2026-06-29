import Link from 'next/link'
import Image from 'next/image'
import type {Resource} from '@/sanity/types'
import {urlFor} from '@/sanity/image'
import {DownloadButton} from './DownloadButton'

type ResourceCardProps = {
  resource: Resource
  consentText?: string
}

export function ResourceCard({resource, consentText}: ResourceCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-accent/30 hover:bg-white/[0.04] hover:shadow-[0_0_24px_rgba(34,211,238,0.08)]">
      <Link href={`/resource-library/${resource.slug}`} className="flex flex-1 flex-col p-6">
        {resource.image && (
          <div className="relative mb-4 aspect-video overflow-hidden rounded-xl bg-white/5">
            <Image
              src={urlFor(resource.image).width(600).height(340).url()}
              alt={resource.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <span className="mb-3 inline-flex w-fit rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
          {resource.resourceType}
        </span>
        <h3 className="text-xl font-semibold text-white">{resource.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50">
          {resource.shortDescription}
        </p>
      </Link>
      <div className="border-t border-white/10 p-4">
        <DownloadButton resource={resource} consentText={consentText} />
      </div>
    </article>
  )
}
