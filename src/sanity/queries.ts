import {client} from './client'
import type {Category, Resource, ResourceWithNeighbors, SiteSettings} from './types'

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(`*[_type == "siteSettings"][0]{
    siteTitle,
    heroTitle,
    heroSubtitle,
    heroImage,
    heroPrimaryCta,
    heroSecondaryCta,
    libraryIndexLabel,
    libraryIndexStatus,
    ctaSection,
    newsletter,
    defaultDownloadGate,
    footerText,
    disclaimerText,
    navLinks
  }`)
}

export async function getCategories(): Promise<Category[]> {
  return client.fetch(`*[_type == "category"] | order(sortOrder asc) {
    _id,
    title,
    "slug": slug.current,
    sectionTitle,
    sectionDescription,
    sectionImage,
    pageIntro,
    sortOrder
  }`)
}

export async function getResources(): Promise<Resource[]> {
  return client.fetch(`*[_type == "resource"] | order(sortOrder asc) {
    _id,
    title,
    "slug": slug.current,
    resourceType,
    shortDescription,
    image,
    downloadLabel,
    downloadGate,
    downloadFile{asset->{url}},
    downloadUrl,
    featured,
    sortOrder,
    publishedAt,
    category->{_id, title, "slug": slug.current}
  }`)
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      sectionTitle,
      sectionDescription,
      sectionImage,
      pageIntro,
      sortOrder
    }`,
    {slug},
  )
}

export async function getResourcesByCategory(slug: string): Promise<Resource[]> {
  return client.fetch(
    `*[_type == "resource" && category->slug.current == $slug] | order(sortOrder asc) {
      _id,
      title,
      "slug": slug.current,
      resourceType,
      shortDescription,
      image,
      downloadLabel,
      downloadGate,
      downloadFile{asset->{url}},
      downloadUrl,
      featured,
      sortOrder,
      publishedAt,
      category->{_id, title, "slug": slug.current}
    }`,
    {slug},
  )
}

export async function getDownloadableResources(): Promise<Resource[]> {
  return client.fetch(`*[_type == "resource" && (defined(downloadUrl) || defined(downloadFile))] | order(sortOrder asc) {
    _id,
    title,
    "slug": slug.current,
    resourceType,
    shortDescription,
    image,
    downloadLabel,
    downloadGate,
    downloadFile{asset->{url}},
    downloadUrl,
    category->{_id, title, "slug": slug.current}
  }`)
}

export async function getResourceBySlug(slug: string): Promise<ResourceWithNeighbors | null> {
  return client.fetch(
    `*[_type == "resource" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      resourceType,
      shortDescription,
      image,
      body,
      downloadLabel,
      downloadGate,
      downloadFile{asset->{url}},
      downloadUrl,
      featured,
      sortOrder,
      publishedAt,
      category->{_id, title, "slug": slug.current},
      "prev": *[_type == "resource" && category._ref == ^.category._ref && sortOrder < ^.sortOrder] | order(sortOrder desc)[0]{title, "slug": slug.current},
      "next": *[_type == "resource" && category._ref == ^.category._ref && sortOrder > ^.sortOrder] | order(sortOrder asc)[0]{title, "slug": slug.current}
    }`,
    {slug},
  )
}

export const CATEGORY_SLUGS = ['bots', 'research', 'utilities'] as const

export function isCategorySlug(slug: string): slug is (typeof CATEGORY_SLUGS)[number] {
  return (CATEGORY_SLUGS as readonly string[]).includes(slug)
}
