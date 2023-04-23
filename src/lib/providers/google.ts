
import { google } from 'googleapis'
import fetch from 'isomorphic-fetch'
import { Email } from '../process-email';
import { threadId } from 'worker_threads';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)

export function makeBody(to: string[], from: string, subject: string, message: string) {
    const str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to.join(', '), "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    const encodedMail = Buffer.from(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_')
    return encodedMail
}

export const createGmailDraftAndNotify = async (profile: any, to: string[], subject: string, text: string, email: Email) => { 
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

    const q = `${email.subject} to: ${to.join(', ')} from: ${email.from.address}`

    console.log(q)
    const threads = await gmail.users.messages.list({
      userId: 'me',
      q,
    })

    if (threads.data.messages!.length > 1) {
      console.log('thread has reply', threads.data.messages)
      return
    }

    const raw = makeBody(to, profile.email, subject, text)
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

    await gmail.users.messages.modify({
      userId: 'me',
      id: draft.data.message!.id!,
      requestBody: {
        addLabelIds: ['INBOX', 'UNREAD']
      }
    })

    return threads.data.messages![0].threadId!
  }