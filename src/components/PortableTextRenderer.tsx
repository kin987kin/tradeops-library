import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/react'
import Image from 'next/image'
import {urlFor} from '@/sanity/image'

const components: PortableTextComponents = {
  block: {
    h2: ({children}) => (
      <h2 className="mt-10 mb-4 text-2xl font-semibold text-white">{children}</h2>
    ),
    h3: ({children}) => (
      <h3 className="mt-8 mb-3 text-xl font-semibold text-white">{children}</h3>
    ),
    h4: ({children}) => (
      <h4 className="mt-6 mb-2 text-lg font-medium text-white">{children}</h4>
    ),
    normal: ({children}) => (
      <p className="mb-4 text-base leading-relaxed text-white/60">{children}</p>
    ),
  },
  list: {
    bullet: ({children}) => (
      <ul className="mb-4 ml-5 list-disc space-y-2 text-white/60">{children}</ul>
    ),
    number: ({children}) => (
      <ol className="mb-4 ml-5 list-decimal space-y-2 text-white/60">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({children}) => <li className="leading-relaxed">{children}</li>,
    number: ({children}) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
    link: ({value, children}) => (
      <a
        href={value?.href}
        className="text-white underline underline-offset-4 hover:text-white/80"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({value}) =>
      value?.asset ? (
        <div className="relative my-8 aspect-video overflow-hidden rounded-2xl">
          <Image
            src={urlFor(value).width(1200).height(675).url()}
            alt={value.alt ?? ''}
            fill
            className="object-cover"
          />
        </div>
      ) : null,
  },
}

type PortableTextRendererProps = {
  value: PortableTextBlock[]
}

export function PortableTextRenderer({value}: PortableTextRendererProps) {
  return (
    <div className="prose-invert max-w-none">
      <PortableText value={value} components={components} />
    </div>
  )
}
