import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { handleAllEvents } from '~/cron/cron'

export async function POST () {
  console.log('log-event-trigger')
  if (headers().get('Authorization') !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
    return NextResponse.json({ error: 'Auth failed' })
  }

  await handleAllEvents()
  return NextResponse.json({ message: 'ok' })
}
