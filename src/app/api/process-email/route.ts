import { NextResponse } from 'next/server'
import { IncomingEmail } from '~/supabase/types'
import { processIncomingEmail } from '~/inngest/process-incoming-email'
// import { writeFile } from 'fs/promises'

export const revalidate = 0

export async function POST (request: Request) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
    console.error('Auth failed')
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
