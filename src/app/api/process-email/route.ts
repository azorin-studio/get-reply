import 'server-only'

import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { processEmail } from '~/lib/process-email'

export async function POST (request: Request) {
  console.log('POST /api/process-email')

  const { email } = await request.json()

  if (headers().get('Authorization') !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
    // TODO check dmarc and stuff
    console.log('Auth failed')
    console.log(JSON.stringify(email, null, 2))
    return NextResponse.json({ error: 'Auth failed' })
  }

  console.log('Auth passed')
  console.log(email)
  const res = await processEmail(email)
  return NextResponse.json({ res })
}
