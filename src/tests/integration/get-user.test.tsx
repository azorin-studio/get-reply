import getUser from '~/lib/get-user'
import '@testing-library/jest-dom'
import { google } from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)

describe('supabase', () => {
  test('gets user from supabase', async () => {
    // https://github.com/supabase/supabase/issues/347
    // https://github.com/vercel/nextjs-subscription-payments/blob/main/schema.sql#L1-L17
    const { profile } = await getUser()   
    
    const tokens = {
      refresh_token: profile.google_refresh_token,
      access_token: profile.google_access_token
    }

    oauth2Client.setCredentials(tokens)

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
    const res = await gmail.users.drafts.create({
      userId: 'me',
      message: {
        payload: {
          partId: "",
          mimeType: "",
          filename: "",
          headers: [{
            to: "me@eoinmurray.eu",
            from: "me@eoinmurray.eu",
            subject: "api test draft"
          }],
          body: {},
          parts: [{}]
        }
      }
    })
    const labels = res.data.labels
    if (!labels || labels.length === 0) {
      console.log('No labels found.')
      return
    }
    console.log('Labels:')
    labels.forEach((label) => {
      console.log(`- ${label.name}`)
    })

  })
})