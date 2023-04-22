import 'server-only'

import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { processEmail } from '~/lib/process-email'

export async function POST (request: Request) {
  console.log('POST /api/process-email')

  const { email } = await request.json()

  const from = email.from.address
  const subject = email.subject
  const text = email.text

  if (headers().get('Authorization') !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
    console.log('Auth failed')
    console.log(JSON.stringify(email, null, 2))
    return NextResponse.json({ error: 'Auth failed' })
  }

  console.log('INCOMING EMAIL')
  console.log({ from, subject, text })

  // const res = await processEmail(from, subject, text)
  return NextResponse.json({ status: 'ok' })
}
