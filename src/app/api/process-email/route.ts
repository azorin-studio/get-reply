import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { handleProcessEmailEvent } from '~/cron/cron'
import { IncomingEmail } from '~/db/types'

export const revalidate = 0

export async function POST (request: Request) {
  if (headers().get('Authorization') !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
    return NextResponse.json({ error: 'Auth failed' })
  }

  const json = await request.json()
  if (json.attachments) {
    delete json.attachments
  }

  try {
    return NextResponse.json(await handleProcessEmailEvent(json as IncomingEmail))
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}
