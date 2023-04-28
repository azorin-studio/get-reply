
import { google } from 'googleapis'
import fetch from 'isomorphic-fetch'
import { Contact } from '~/types'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)

export function makeBody(to: Contact[], from: Contact, subject: string, message: string) {
    const str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to.map(t => t.address).join(', '), "\n",
        "from: ", from.address, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('')

    const encodedMail = Buffer.from(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_')
    return encodedMail
}

export const refreshAccessToken = async (google_refresh_token: string) => {
  const form = new URLSearchParams()
  form.append('client_id', process.env.GOOGLE_CLIENT_ID!)
  form.append('client_secret', process.env.GOOGLE_CLIENT_SECRET!)
  form.append('grant_type', 'refresh_token')
  form.append('refresh_token', google_refresh_token)

  const authResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString()
  })

  const newTokens = await authResponse.json()
  const tokens = {
    refresh_token: google_refresh_token,
    access_token: newTokens.access_token
  }
  return tokens
}

export const createGmailDraftInThread = async (to: Contact[], from: Contact, subject: string, text: string, threadId: string, google_refresh_token: string) => {
  const tokens = await refreshAccessToken(google_refresh_token)
  oauth2Client.setCredentials(tokens)
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
  const raw = makeBody(to, from, subject, text)
  const res = await gmail.users.drafts.create({
    userId: 'me',
    requestBody: {
      message: {
        raw,
        threadId
      }
    }
  })
  return res.data
}

export const deleteDraft = async (draftId: string, google_refresh_token: string) => {
  const tokens = await refreshAccessToken(google_refresh_token)
  oauth2Client.setCredentials(tokens)
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
  const res = await gmail.users.drafts.delete({
    userId: 'me',
    id: draftId
  })
  return res.data
}

export const findThread = async (subject: string, to: Contact[], google_refresh_token: string) => {
  const tokens = await refreshAccessToken(google_refresh_token)
  oauth2Client.setCredentials(tokens)
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
  const q = `${subject} to: ${to.map(t => t!.address).join(', ')}`
  const threads = await gmail.users.threads.list({
    userId: 'me',
    q,
  })

  if (!threads.data.threads || threads.data.resultSizeEstimate === 0) {
    throw Error(`cannot find thread for q=${q}.`)
  }

  if (threads.data.threads.length > 1) {
    throw Error('thread has reply or other draft.')
  }

  return threads.data.threads[0] as any
}

export const makeUnreadInInbox = async (draft: any) => {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
  await gmail.users.messages.modify({
    userId: 'me',
    id: draft.message!.id!,
    requestBody: {
      addLabelIds: ['INBOX', 'UNREAD']
    }
  })
}
