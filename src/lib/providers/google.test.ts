
import { google } from 'googleapis'
import fetch from 'isomorphic-fetch'

import getUser from '../get-user'
import { makeBody } from './google'
import sample from './sample'

console.log(JSON.stringify(sample, null, 2))

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)


describe('GMAIL', () => {
  test('gets thread from gmail', async () => {
    // https://github.com/supabase/supabase/issues/347
    // https://github.com/vercel/nextjs-subscription-payments/blob/main/schema.sql#L1-L17
    const { profile } = await getUser()   

    const form = new URLSearchParams()
    form.append('client_id', process.env.GOOGLE_CLIENT_ID!)
    form.append('client_secret', process.env.GOOGLE_CLIENT_SECRET!)
    form.append('grant_type', 'refresh_token')
    form.append('refresh_token', profile.google_refresh_token)

    const authResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString()
    })

    const newTokens = await authResponse.json()

    const tokens = {
      refresh_token: profile.google_refresh_token,
      access_token: newTokens.access_token
    }

    oauth2Client.setCredentials(tokens)
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    const to = sample.to.map(t => t.address)
    const q = `${sample.subject} to: ${to} from: ${sample.from.address}`

    console.log({q})
    const threads = await gmail.users.messages.list({
      userId: 'me',
      q,
    })

    console.log(threads.data)
    if (!threads.data.messages || threads.data.messages!.length > 1) {
      console.log('thread has reply or is deleted')
      return
    }

    console.log(threads.data.messages)

    const thread = await gmail.users.threads.get({
      userId: 'me',
      id: threads.data.messages![0].threadId!,
    })
    
    console.log(thread.data.messages)

    const raw = makeBody(to, profile.email, sample.subject, 'draft body')
    console.log(raw)
    const draft = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          threadId: threads.data.messages![0].threadId!,
          raw
        }
      }
    })
    console.log(draft.data.message)

    await gmail.users.messages.modify({
      userId: 'me',
      id: draft.data.message!.id!,
      requestBody: {
        addLabelIds: ['INBOX', 'UNREAD']
      }
    })
  })
})