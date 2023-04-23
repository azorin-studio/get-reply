import 'server-only'

import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { processEmail } from '~/lib/process-email'
import { IncomingEmail } from '~/types'

export async function POST (request: Request) {
  const json = await request.json()
  const email: IncomingEmail = json.email

  if (headers().get('Authorization') !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
    // TODO check dmarc and stuff
    console.log('Auth failed')
    console.log(JSON.stringify(email, null, 2))
    return NextResponse.json({ error: 'Auth failed' })
  }

  const res = await processEmail(email)
  return NextResponse.json(res)
}
