import { NextResponse } from 'next/server'
import { IncomingEmail } from '~/lib/types'
import { processIncomingEmail } from '~/lib/functions'
import { writeFile } from 'fs/promises'

export const revalidate = 0

export async function POST (request: Request) {
  if (process.env.NODE_ENV === 'production' && request.headers.get('Authorization') !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
    console.error('Auth failed')
    console.log('node env is prod', process.env.NODE_ENV === 'production')
    console.log('token check', request.headers.get('Authorization') !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`)
    if (request.headers.get('Authorization') !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
      console.log('token', request.headers.get('Authorization'), 'did not match', `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`)
    }
    return NextResponse.json({ error: 'Auth failed' }, { status: 401 })
  }

  const json = await request.json()
  if (json.attachments) {
    delete json.attachments
  }

  // writeFile(`./src/tests/fixtures/${json.messageId}.json`, JSON.stringify(json, null, 2))

  try {
    const logs = await processIncomingEmail(json as IncomingEmail)
    return NextResponse.json({ logs })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message })
  }
}
