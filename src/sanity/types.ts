import type {PortableTextBlock} from '@portabletext/react'

export type NavLink = {
  label: string
  href: string
}

export type SiteSettings = {
  siteTitle: string
  heroTitle: string
  heroSubtitle: string
  heroImage?: {asset: {_ref: string}}
  heroPrimaryCta?: {label: string; href: string}
  heroSecondaryCta?: {label: string; href: string}
  libraryIndexLabel: string
  libraryIndexStatus: string
  ctaSection?: {
    title: string
    body: string
    primaryLabel: string
    primaryHref: string
    secondaryLabel: string
    secondaryHref: string
    showNewsletterForm?: boolean
  }
  newsletter?: {
    title: string
    description: string
    promise: string
    consentText: string
    showInHero?: boolean
    showInFooter?: boolean
  }
  defaultDownloadGate?: 'none' | 'email'
  footerText: string
  disclaimerText?: string
  navLinks?: NavLink[]
}

export type Category = {
  _id: string
  title: string
  slug: string
  sectionTitle?: string
  sectionDescription?: string
  sectionImage?: {asset: {_ref: string}}
  pageIntro?: string
  sortOrder?: number
}

export type Resource = {
  _id: string
  title: string
  slug: string
  resourceType: string
  shortDescription: string
  image?: {asset: {_ref: string}}
  body?: PortableTextBlock[]
  downloadLabel?: string
  downloadGate?: 'none' | 'email'
  downloadFile?: {asset: {_ref: string; url?: string}}
  downloadUrl?: string
  featured?: boolean
  sortOrder?: number
  publishedAt?: string
  category?: {
    _id: string
    title: string
    slug: string
  }
}

export type ResourceWithNeighbors = Resource & {
  prev?: {title: string; slug: string} | null
  next?: {title: string; slug: string} | null
}
