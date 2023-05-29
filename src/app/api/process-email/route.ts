import { NextResponse } from 'next/server'
import { IncomingEmail } from '~/db-admin/types'
import { queue } from '~/queue/queue'

export const revalidate = 0

export async function POST (request: Request) {
  if (process.env.NODE_ENV === 'production' && 'Authorization' !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
    return NextResponse.json({ error: 'Auth failed' })
  }

  const json = await request.json()
  if (json.attachments) {
    delete json.attachments
  }

  try {
    return NextResponse.json(await queue.add('process-incoming-mail', json as IncomingEmail))
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}
