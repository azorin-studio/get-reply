import { Profile } from '~/supabase/types';
import { checkForReply, createGmailDraftInThread, getThreadById, sendDraft } from '~/lib/google'
import {supabaseAdminClient, getProfileFromEmail } from '~/supabase/supabase';

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

export const liveGmailTest = async ({
  to, 
}: {
  to: string[],
}) => {
  const FROM = process.env.TEST_GMAIL_USER
  if (!FROM) throw new Error('No test gmail user found')
  
  const profile: Profile = await getProfileFromEmail(supabaseAdminClient, FROM)
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
  
  const profile: Profile = await getProfileFromEmail(supabaseAdminClient, FROM)
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