import { NextResponse } from 'next/server'

function sameOrigin(req: Request) {
  const requestOrigin = new URL(req.url).origin
  const origin = req.headers.get('origin')
  if (origin) {
    return origin === requestOrigin
  }

  const referer = req.headers.get('referer')
  if (referer) {
    try {
      return new URL(referer).origin === requestOrigin
    } catch {
      return false
    }
  }

  return req.headers.get('sec-fetch-site') === 'same-origin'
}

function hasBearerToken(req: Request, token: string | undefined) {
  if (!token) {
    return false
  }

  return req.headers.get('authorization') === `Bearer ${token}`
}

export function requireSameOrigin(req: Request) {
  if (sameOrigin(req)) {
    return null
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function requireSameOriginOrBrainToken(req: Request) {
  if (sameOrigin(req) || hasBearerToken(req, process.env.BRAIN_API_TOKEN)) {
    return null
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
