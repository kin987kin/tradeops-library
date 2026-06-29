import {NextResponse} from 'next/server'
import {subscribeToNewsletter, type NewsletterSource} from '@/lib/newsletter'

type SubscribeRequest = {
  email?: string
  consent?: boolean
  source?: NewsletterSource
  resourceSlug?: string
}

const VALID_SOURCES: NewsletterSource[] = ['hero', 'footer', 'cta', 'download-gate']

export async function POST(request: Request) {
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

  const result = await subscribeToNewsletter({
    email: body.email?.trim() ?? '',
    consent: Boolean(body.consent),
    source,
    resourceSlug: body.resourceSlug?.trim() || undefined,
  })

  if (!result.ok) {
    return NextResponse.json({error: result.error}, {status: 400})
  }

  return NextResponse.json({ok: true})
}
