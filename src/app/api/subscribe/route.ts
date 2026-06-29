import {connection} from 'next/server'
import {NextResponse} from 'next/server'
import type {NewsletterSource} from '@/lib/newsletter-shared'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type SubscribeRequest = {
  email?: string
  consent?: boolean
  source?: NewsletterSource
  resourceSlug?: string
}

const VALID_SOURCES: NewsletterSource[] = ['hero', 'footer', 'cta', 'download-gate']

const BUTTONDOWN_API = 'https://api.buttondown.com/v1/subscribers'

/** Runtime-only read — avoids Turbopack inlining undefined for Sensitive env vars at build. */
async function readButtondownApiKey() {
  const {env} = await import('node:process')
  const name = ['BUTTONDOWN', 'API', 'KEY'].join('_')
  const value = env[name]
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

export async function GET() {
  await connection()
  const configured = Boolean(await readButtondownApiKey())
  return NextResponse.json({configured})
}

export async function POST(request: Request) {
  await connection()

  let body: SubscribeRequest

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({error: 'Invalid request body.'}, {status: 400})
  }

  const source = body.source ?? 'cta'
  if (!VALID_SOURCES.includes(source)) {
    return NextResponse.json({error: 'Invalid source.'}, {status: 400})
  }

  const email = body.email?.trim() ?? ''
  const consent = Boolean(body.consent)
  const resourceSlug = body.resourceSlug?.trim() || undefined

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({error: 'Please enter a valid email address.'}, {status: 400})
  }

  if (!consent) {
    return NextResponse.json({error: 'Please agree to receive email updates.'}, {status: 400})
  }

  const apiKey = await readButtondownApiKey()
  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[newsletter] Dev mode — no BUTTONDOWN_API_KEY')
      return NextResponse.json({ok: true})
    }
    return NextResponse.json(
      {error: 'Newsletter signup is not configured yet. Please try again later.'},
      {status: 400},
    )
  }

  const tags = [`source:${source}`]
  if (resourceSlug) {
    tags.push(`download:${resourceSlug}`)
  }

  const response = await fetch(BUTTONDOWN_API, {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: email,
      tags,
      metadata: {
        source,
        resourceSlug: resourceSlug ?? null,
        consentAt: new Date().toISOString(),
      },
    }),
  })

  if (response.ok) {
    return NextResponse.json({ok: true})
  }

  const responseBody = (await response.json().catch(() => null)) as {detail?: string} | null
  const detail = responseBody?.detail ?? ''

  if (response.status === 409 || detail.toLowerCase().includes('already')) {
    return NextResponse.json({ok: true})
  }

  console.error('[newsletter] Buttondown error:', response.status, detail)
  return NextResponse.json({error: 'Could not subscribe right now. Please try again.'}, {status: 400})
}
