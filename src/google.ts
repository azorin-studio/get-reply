
import { google } from 'googleapis'
import fetch from 'isomorphic-fetch'
import { Contact } from '~/db-admin/types'

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

  if (!authResponse.ok) {
    // should delete the token from the user so they can re-authenticate
    throw new Error(`Gmail ${newTokens.error_description.toLowerCase()}`)
  }

  const tokens = {
    refresh_token: google_refresh_token,
    access_token: newTokens.access_token
  }

  return tokens
}

export const createGmailDraftInThread = async (
  to: Contact[], 
  from: Contact, 
  subject: string, 
  text: string, 
  threadId: string | null | undefined, 
  google_refresh_token: string
) => {
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
  console.log('finding thread', q)
  const threads = await gmail.users.threads.list({
    userId: 'me',
    q,
  })

  if (!threads.data.threads || threads.data.resultSizeEstimate === 0) {
    console.log('no threads found')
    return null
  }

  return threads.data.threads[0] as any
}

export const getThreadById = async (id: string, google_refresh_token: string) => {
  const tokens = await refreshAccessToken(google_refresh_token)
  oauth2Client.setCredentials(tokens)
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

  const thread = await gmail.users.threads.get({
    userId: 'me',
    id,
  })

  if (!thread) {
    console.log('no thread found')
    return null
  }

  return thread as any
}

export const getMessageById = async (id: string, google_refresh_token: string) => {
  const tokens = await refreshAccessToken(google_refresh_token)
  oauth2Client.setCredentials(tokens)
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

  const message = await gmail.users.messages.get({
    userId: 'me',
    id,
  })

  if (!message) {
    console.log('no message found')
    return null
  }

  return message as any
}


export const makeUnreadInInbox = async (draftId: string, google_refresh_token: string) => {
  const tokens = await refreshAccessToken(google_refresh_token)
  oauth2Client.setCredentials(tokens)
  
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

  await gmail.users.messages.modify({
    userId: 'me',
    id: draftId,
    requestBody: {
      addLabelIds: ['INBOX', 'UNREAD']
    }
  })
}

export const sendDraft = async (draftId: string, google_refresh_token: string) => {
  const tokens = await refreshAccessToken(google_refresh_token)
  oauth2Client.setCredentials(tokens)
  
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

  return await gmail.users.drafts.send({
    userId: 'me',
    requestBody: {
      id: draftId,
    },
  })
}

