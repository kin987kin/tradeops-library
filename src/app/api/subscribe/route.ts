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

const EXPECTED_KEY = 'BUTTONDOWN_API_KEY'

/** Runtime-only read — avoids Turbopack inlining undefined for Sensitive env vars at build. */
async function readButtondownApiKey() {
  const {env} = await import('node:process')
  const value = env[EXPECTED_KEY]
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

type KeyStatus = 'missing' | 'empty' | 'set'

async function diagnoseButtondownEnv() {
  const {env} = await import('node:process')

  const typoCandidates = [
    'BUTTONDOWN_API_KEY',
    'buttondown_API_KEY',
    'Buttondown_Api_Key',
    'BUTTONDOWNBUTTONDOWN_API_KEY',
  ]

  const matchingEnvKeys = Object.keys(env)
    .filter((key) => /buttondown/i.test(key))
    .sort()

  const candidateStatus: Record<string, KeyStatus> = {}
  for (const name of typoCandidates) {
    const raw = env[name]
    if (raw === undefined) {
      candidateStatus[name] = 'missing'
    } else if (typeof raw !== 'string' || !raw.trim()) {
      candidateStatus[name] = 'empty'
    } else {
      candidateStatus[name] = 'set'
    }
  }

  const primary = env[EXPECTED_KEY]
  const configured = typeof primary === 'string' && primary.trim().length > 0

  return {
    configured,
    expectedKey: EXPECTED_KEY,
    matchingEnvKeys,
    candidateStatus,
    valueLength: configured && typeof primary === 'string' ? primary.trim().length : 0,
    hint: configured
      ? 'API key is present — subscribe should work if Buttondown accepts the key.'
      : matchingEnvKeys.length === 0
        ? 'No BUTTONDOWN env keys found on this deployment. Add BUTTONDOWN_API_KEY in Vercel, then redeploy.'
        : candidateStatus[EXPECTED_KEY] === 'empty'
          ? 'BUTTONDOWN_API_KEY exists but is empty. Delete and re-add with your Buttondown key (do not Save Edit with a blank value).'
          : 'BUTTONDOWN_API_KEY missing or wrong name — check exact spelling and casing in Vercel.',
  }
}

export async function GET() {
  await connection()
  return NextResponse.json(await diagnoseButtondownEnv())
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
