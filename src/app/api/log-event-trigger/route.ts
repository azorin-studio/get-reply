import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { handleAllEvents } from '~/cron/cron'

export const revalidate = 0

export async function POST (request: Request) {
  if (headers().get('Authorization') !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
    return NextResponse.json({ error: 'Auth failed' })
  }

  const json = await request.json()
  console.log('log-event-trigger route', JSON.stringify(json, null, 2))

  return NextResponse.json(await handleAllEvents())
}
