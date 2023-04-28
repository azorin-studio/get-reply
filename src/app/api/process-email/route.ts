import 'server-only'

import { NextResponse } from 'next/server'
import { processEmail } from '~/process-email'
import { IncomingEmail } from '~/types'

export async function POST (request: Request) {
  const json = await request.json()

  if (json.attachments) {
    delete json.attachments
  }

  const email: IncomingEmail = json

  // console.log(email)
  // if (headers().get('Authorization') !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
  //   // TODO check dmarc and stuff
  //   console.log('Auth failed')
  //   console.log(JSON.stringify(email, null, 2))
  //   return NextResponse.json({ error: 'Auth failed' })
  // }
  
  if (!email.from) {
    console.log('No from')
    console.log(JSON.stringify(email, null, 2))
    console.log(JSON.stringify(json, null, 2))
    return NextResponse.json({ error: 'No from' })
  }  

  return NextResponse.json(await processEmail(email))
}
