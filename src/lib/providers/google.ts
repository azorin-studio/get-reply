
import '@testing-library/jest-dom'
import { google } from 'googleapis'
import fetch from 'isomorphic-fetch'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)

function makeBody(to: string, from: string, subject: string, message: string) {
    const str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    const encodedMail = Buffer.from(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_')
    return encodedMail
}

export const createGmailDraftAndNotify = async (profile: any, subject: string, email: string) => { 
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

    oauth2Client.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        console.log(tokens.refresh_token)
      }
      console.log(tokens.access_token)
    })

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
    const raw = makeBody('noreply@getreply.app', profile.email, subject, email)
    const draft = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
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
  }