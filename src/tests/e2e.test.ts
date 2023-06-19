import getProfileFromEmail from '~/db-admin/get-profile-from-email'
import { Profile } from '~/db-admin/types'
import { checkForReply, createGmailDraftInThread, getThreadById, sendDraft } from '~/lib/google'
import { introText as replyIntroText } from '~/inngest/processes/reply'
import { introText as followupIntroText } from '~/inngest/processes/followup'

const wait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))
;


const watch = async (predicate: Function, ms: number) => {
  for (;; await wait(ms)) {
    const result = await predicate();
    
    if (result) {
      return result;
    }
  }
}


const liveGmailTest = async ({
  to, 
  from,
  refresh_token,
  expectedReplies
}: {
  to: string[],
  from: string,
  refresh_token: string
  expectedReplies: string[]
}) => {
  const r = Math.random().toString(36).slice(2, 7)

  const draft = await createGmailDraftInThread({
    to, 
    from,
    subject: `${r}`, 
    text: `Print the word ${r}`, 
    threadId: null,
    refresh_token: refresh_token
  })

  const { data } = await sendDraft(draft.id!, refresh_token)
  if (!data.threadId) throw new Error('Cant find thread after sending draft.')

  const thread = await getThreadById(data.threadId, refresh_token)
  const mail = thread.messages.find((m: any) => m.id === data.id)
  if (!mail) throw new Error('Cant find message in thread after sending draft.') 

  const messageId = mail.payload.headers.find((h: any) => h.name.toLowerCase() === 'message-id')?.value
  const threadId = thread.id

  if (!messageId) throw new Error('Cant find message id in thread after sending draft.')
  if (!threadId)  throw new Error('Cant find thread id in thread after sending draft.')

  return { messageId, threadId }
}

const from = 'amonecho1@gmail.com'
// this allows us to send emails to getreply, pc or laptop
const emailRoutingTag = process.env.EMAIL_ROUTING_TAG || ''

describe('e2e', () => {
  it.concurrent('should use gmail to hit the reply sequence then check for reply in inbox', async () => {
    const profile: Profile = await getProfileFromEmail(from)
    if (!profile) throw new Error('No profile found')

    const { messageId, threadId } = await liveGmailTest({
      to: [`reply${emailRoutingTag}@getreply.app`],
      from,
      refresh_token: profile.refresh_token!,
      expectedReplies: ['reply']
    })
    
    const replies = await Promise.all(
      [1, 2].map(async () => {
        return watch(async () => {      
          return checkForReply(threadId, messageId, profile.refresh_token!)
        }, 1000)
      })
    )
  
    replies.forEach((r: any) => expect(r.snippet).toContain(replyIntroText))
  }, 1000 * 60) // wait 1 minute

  it.concurrent('should use gmail to hit the fastfollowup sequence then check for in inbox', async () => {
    const profile: Profile = await getProfileFromEmail(from)
    if (!profile) throw new Error('No profile found')

    const { messageId, threadId } = await liveGmailTest({
      to: [`fastfollowup${emailRoutingTag}@getreply.app`],
      from,
      refresh_token: profile.refresh_token!,
      expectedReplies: ['reply', 'reply']
    })

    const replies = await Promise.all(
      [1, 2].map(async () => {
        return watch(async () => {      
          return checkForReply(threadId, messageId, profile.refresh_token!)
        }, 1000)
      })
    )
  
    replies.forEach((r: any) => expect(r.snippet).toContain(followupIntroText))
  }, 1000 * 60) // wait 1 minute
  
  // it.only('should use gmail to hit the collab sequence', async () => {
  //   const profile: Profile = await getProfileFromEmail(from)
  //   if (!profile) {
  //     throw new Error('No profile found')
  //   }

  //   await liveGmailTest({
  //     to: [`collab${emailRoutingTag}@getreply.app`, 'me@eoinmurray.eu'],
  //     from,
  //     refresh_token: profile.refresh_token!,
  //     expectedReplies: ['reply']
  //   })
  // }, 1000 * 60) // wait 1 minute
})