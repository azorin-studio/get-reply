import { NextResponse } from 'next/server'
import { IncomingEmail } from '~/supabase/types'
import { processIncomingEmail } from '~/bus/event-list'

// handy for debugging
// import { writeFile } from 'fs/promises'
// writeFile(`./src/tests/fixtures/${json.messageId}.json`, JSON.stringify(json, null, 2))

export const revalidate = 0

export async function POST (request: Request) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
    if (request.headers.get('Authorization') !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {    
    }
    return NextResponse.json({ error: 'Auth failed' }, { status: 401 })
  }

  const json = await request.json()
  if (json.attachments) {
    delete json.attachments
  }

  const logs = await processIncomingEmail(json as IncomingEmail)
  return NextResponse.json({ logs })
}
