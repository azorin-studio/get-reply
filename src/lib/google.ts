
import { google } from 'googleapis'
import fetch from 'isomorphic-fetch'

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
    ].join('')

    const encodedMail = Buffer.from(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_')
    return encodedMail
}

export const refreshAccessToken = async (refresh_token: string) => {
  const form = new URLSearchParams()
  form.append('client_id', process.env.GOOGLE_CLIENT_ID!)
  form.append('client_secret', process.env.GOOGLE_CLIENT_SECRET!)
  form.append('grant_type', 'refresh_token')
  form.append('refresh_token', refresh_token)

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
    refresh_token: refresh_token,
    access_token: newTokens.access_token
  }

  return tokens
}

export const createDriveFolder = async (name: string, refresh_token: string) => {
  const tokens = await refreshAccessToken(refresh_token)
  oauth2Client.setCredentials(tokens)

  const drive = google.drive({ version: 'v3', auth: oauth2Client })
  
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
    }
  })

  return res.data
}

interface ICreateGmailDriveFile {
  text: string,
  refresh_token: string
}

export const createDriveFile = async ({
  text, 
  refresh_token,
}: ICreateGmailDriveFile) => {
  const tokens = await refreshAccessToken(refresh_token)
  oauth2Client.setCredentials(tokens)

  const docs = google.docs({ version: 'v1', auth: oauth2Client })
  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  const parent = await createDriveFolder('GetReplyCollab', refresh_token)

  const createFileRes = await docs.documents.create({
    requestBody: {
      title: 'collab',
    }
  })

  await drive.files.update({
    addParents: `${parent.id}`,
    fileId: createFileRes.data.documentId!,
  });

  const updateFileRes = await docs.documents.batchUpdate({
    documentId: createFileRes.data.documentId!,
    requestBody: {
      requests: [
        {
          insertText: {
            text,
            endOfSegmentLocation: {
              segmentId: ''
            }
          }
        }
      ]
    }
  })

  const permissionIds = [];

  const permissions = [
    {
      type: 'user',
      role: 'writer',
      emailAddress: 'amonecho1@gmail.com',
    },
    {
      type: 'user',
      role: 'writer',
      emailAddress: 'me@eoinmurray.eu',
    },
  ];

  for (const permission of permissions) {
    try {
      const result = await drive.permissions.create({
        requestBody: permission,
        fileId: createFileRes.data.documentId!,
        fields: 'id',
      });
      permissionIds.push(result.data.id);
    } catch (err) {
      console.error(err);
    }
  }

  const file = await drive.files.get({
    fileId: createFileRes.data.documentId!,
    fields: 'webViewLink',
  });

  return file.data;
}

interface ICreateGmailDraftInThread {
  to: string[],
  from: string,
  subject: string,
  text: string,
  threadId: string | null | undefined,
  refresh_token: string
}


export const createGmailDraftInThread = async ({
  to, 
  from, 
  subject, 
  text, 
  threadId, 
  refresh_token,
}: ICreateGmailDraftInThread) => {
  const tokens = await refreshAccessToken(refresh_token)
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

export const deleteDraft = async (draftId: string, refresh_token: string) => {
  const tokens = await refreshAccessToken(refresh_token)
  oauth2Client.setCredentials(tokens)
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
  const res = await gmail.users.drafts.delete({
    userId: 'me',
    id: draftId
  })
  return res.data
}

export const findThread = async (subject: string, to: string[], refresh_token: string) => {
  const tokens = await refreshAccessToken(refresh_token)
  oauth2Client.setCredentials(tokens)
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
  const q = `${subject} to: ${to.join(', ')}`
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

export const getThreadById = async (id: string, refresh_token: string) => {
  const tokens = await refreshAccessToken(refresh_token)
  oauth2Client.setCredentials(tokens)
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

  const thread = await gmail.users.threads.get({
    userId: 'me',
    id,
  })

  if (!thread || !thread.data) {
    console.log('no thread found')
    return null
  }

  return thread.data as any
}

export const getMessageById = async (id: string, refresh_token: string) => {
  const tokens = await refreshAccessToken(refresh_token)
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


export const makeUnreadInInbox = async (draftId: string, refresh_token: string) => {
  const tokens = await refreshAccessToken(refresh_token)
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

export const sendDraft = async (draftId: string, refresh_token: string) => {
  const tokens = await refreshAccessToken(refresh_token)
  oauth2Client.setCredentials(tokens)
  
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

  return await gmail.users.drafts.send({
    userId: 'me',
    requestBody: {
      id: draftId,
    },
  })
}

export const checkForReply = async (threadId: string, messageId: string, refresh_token: string): 
  Promise<object[] | null> => {
  let thread
  try {
    thread = await getThreadById(threadId, refresh_token)
  }
  catch (e) {
    return null
  }

  const { messages } = thread

  const replyMessages = messages.filter((message: any) => {
    return message.payload.headers.find((header: any) => {
      return header.name.toLowerCase() === 'in-reply-to' && header.value === messageId
    })
  })

  return replyMessages
}

export const checkForDraft = async (threadId: string, messageId: string, refresh_token: string): Promise<object | null> => {
  let thread
  try {
    thread = await getThreadById(threadId, refresh_token)
  }
  catch (e) {
    return null
  }

  const draftedMessage = thread.messages.find((message: any) => {
    return message.labelIds.find((label: any) => label === 'DRAFT')
  })

  return draftedMessage
}