import { NextResponse } from 'next/server'
import { IncomingEmail } from '~/db-admin/types'
import { inngest } from '~/queue/inngest-client'

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
    await inngest.send({ 
      name: 'queue/process-incoming-email', 
      data: json as IncomingEmail 
    })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message })
  }
}
