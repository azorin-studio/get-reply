import 'server-only'

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { IncomingEmail, Log } from '~/types'
import { createLog } from '~/supabase'
import testEmail from '~/data/test-email.json'


export async function POST (request: Request) {
  if (headers().get('Authorization') !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
    return NextResponse.json({ error: 'Auth failed' })
  }

  const json = await request.json()

  if (json.attachments) {
    delete json.attachments
  }

  const incomingEmail: IncomingEmail = json  
  let log: Log | null = null
  try {
    log = await createLog(incomingEmail)
    console.log('starting id:', log.id, 'from', (log.from as any).address)
  } catch (err: any) {
    console.error(err)
    throw err
  }
}

export async function GET () {
  if (testEmail.attachments) {
    delete (testEmail as IncomingEmail).attachments
  }

  let log: Log | null = null
  try {
    log = await createLog(testEmail as IncomingEmail) // status 'pending'
    console.log('starting id:', log.id, 'from', (log.from as any).address)
  } catch (err: any) {
    console.error(err)
    throw err
  }

  return NextResponse.json(log)
}