import 'server-only'

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { IncomingEmail, Log, Profile } from '~/types'
import { appendToLog, createLog, getProfileFromEmail } from '~/supabase'
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

  if (!log.from) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'No from address found in log'
    })
    return log
  }

  const profile: Profile = await getProfileFromEmail(log.from.address)

  if (!profile) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'No profile found for this email'
    })
  }

  let provider = 'google'
  if (profile.google_refresh_token === null) {
    provider = 'getreply'
  }

  log = await appendToLog(log, {
    status: 'user-added',
    user_id: profile.id,
    provider,
  })

  return log

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