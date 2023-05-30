import { NextResponse } from 'next/server'
import { IncomingEmail } from '~/db-admin/types'
import { queue } from '~/queue/queue'

export const revalidate = 0

export async function POST (request: Request) {
  if (process.env.NODE_ENV === 'production' && 'Authorization' !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
    console.error('Auth failed')
    return NextResponse.json({ error: 'Auth failed' }, { status: 401 })
  }

  const json = await request.json()
  if (json.attachments) {
    delete json.attachments
  }

  try {
    
    // await writeFile(`./src/data/test-email.json`, JSON.stringify(json, null, 2))
    return NextResponse.json(await queue.add('process-incoming-mail', json as IncomingEmail))
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}
