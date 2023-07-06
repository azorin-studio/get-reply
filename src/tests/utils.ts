import parse from 'node-html-parser'
import { Profile } from '~/supabase/types';
import { checkForReply, createGmailDraftInThread, getThreadById, sendDraft } from '~/lib/google'
import { getProfileByEmail } from '~/supabase/supabase';
import { supabaseAdminClient } from "~/supabase/server-client"
import processIncomingEmail from "~/bus/process-incoming-email"
import { getLogById } from "~/supabase/supabase"

const SERVER_URL = process.env.SERVER_URL

if (SERVER_URL) {
  console.log(`SERVER_URL: ${SERVER_URL}`)
} else {
  console.log('SERVER_URL: false')
}

export const wait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))
;

export const watch = async (predicate: Function, ms: number) => {
  for (;; await wait(ms)) {
    const result = await predicate();
    
    if (result) {
      return result;
    }
  }
}

export const simulateSendEmail = async (email: any) => {
  /**
   * If SERVER_URL is not set, we testing in one process.
   * If SERVER_URL is set, we send the email to the server.
   */
  if (!SERVER_URL) return await processIncomingEmail(email)
  const re = await fetch(SERVER_URL + '/api/process-email', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(email)
  })
  if (!re.ok) {
    throw new Error(`Failed to send email: ${re.status} ${re.statusText}`)
  }
  const json = await re.json()
  if (json.error) {
    throw new Error(json.error)
  }
  return json
}



export const awaitStatus = (log_id: string) => 
  new Promise((resolve, reject) => {
    const interval = setTimeout(async () => {
      const log = await getLogById(supabaseAdminClient, log_id)
      console.log(`polling [log_id: ${log?.id.slice(0,7)}] status: ${log?.status}`)
      if (log?.status === 'complete') {
        clearTimeout(interval)
        resolve(true)
      } else if (log?.status === 'error') {
        clearTimeout(interval)
        reject(new Error(log.errorMessage || 'Unknown error'))
        console.log(log.errorMessage)
      }
    }, 100)
  })

export const getIdFromReply = (reply: any): string => {
  const body = reply.payload.body
  const decodedBody = Buffer.from(body.data, 'base64').toString()
  const root = parse(decodedBody)
  const logUrl = root.querySelector('a')?.getAttribute('href')
  const logId = logUrl?.replace('https://getreply.app/logs/', '')  
  if (!logId) throw new Error('Cant find log id in reply.')
  return logId
}

export const liveGmailTest = async ({
  to, 
}: {
  to: string[],
}) => {
  const FROM = process.env.TEST_GMAIL_USER
  if (!FROM) throw new Error('No test gmail user found')
  
  const profile: Profile = await getProfileByEmail(supabaseAdminClient, FROM)
  if (!profile) throw new Error('No profile found')

  const r = Math.random().toString(36).slice(2, 7)
  console.log('Email test id:', r)

  const draft = await createGmailDraftInThread({
    to, 
    from: FROM,
    subject: `${r}`, 
    text: `${r}`, 
    threadId: null,
    refresh_token: profile.refresh_token!
  })

  if(!draft.id) throw new Error('Cant find draft id after creating draft.')

  const { data } = await sendDraft(draft.id, profile.refresh_token!)
  if (!data.threadId) throw new Error('Cant find thread after sending draft.')

  const thread = await getThreadById(data.threadId, profile.refresh_token!)
  const mail = thread.messages.find((m: any) => m.id === data.id)
  if (!mail) throw new Error('Cant find message in thread after sending draft.') 

  const messageId = mail.payload.headers.find((h: any) => h.name.toLowerCase() === 'message-id')?.value
  const threadId = thread.id

  if (!messageId) throw new Error('Cant find message id in thread after sending draft.')
  if (!threadId)  throw new Error('Cant find thread id in thread after sending draft.')

  return { messageId, threadId }
}

export const waitForReplies = async ({ 
  threadId, 
  messageId, 
  numberOfExpectedReplies 
}: { 
  threadId: string, 
  messageId: string,
  numberOfExpectedReplies: number,
}) => {
  const FROM = process.env.TEST_GMAIL_USER
  if (!FROM) throw new Error('No test gmail user found')
  
  const profile: Profile = await getProfileByEmail(supabaseAdminClient, FROM)
  if (!profile) throw new Error('No profile found')

  const replies = watch(async () => {
    const replies = await checkForReply(threadId, messageId, profile.refresh_token!)
    if (replies && replies.length === numberOfExpectedReplies) {
      return replies
    }
    return null
  }, 1000)

  return replies
}