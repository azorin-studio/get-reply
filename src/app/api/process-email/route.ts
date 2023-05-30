import { NextResponse } from 'next/server'
import { IncomingEmail } from '~/db-admin/types'
import { inngest } from '~/inngest/client'

export const revalidate = 0

export async function POST (request: Request) {
  if (process.env.NODE_ENV === 'production' && request.headers.get('Authorization') !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
    console.error('Auth failed')
    return NextResponse.json({ error: 'Auth failed' }, { status: 401 })
  }

  const json = await request.json()
  if (json.attachments) {
    delete json.attachments
  }

  try {
    console.log('Sending to inngest')
    await inngest.send({ 
      name: 'queue/process-incoming-email', 
      data: json as IncomingEmail 
    })
    console.log('Sent to inngest')
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message })
  }
}
