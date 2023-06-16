import getProfileFromEmail from '~/db-admin/get-profile-from-email'
import { Profile } from '~/db-admin/types'
import { checkForDraft, checkForReply, createGmailDraftInThread, getThreadById, sendDraft } from '~/google'


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
  google_refresh_token,
  expectedReplies
}: {
  to: string[],
  from: string,
  google_refresh_token: string
  expectedReplies: string[]
}) => {
  const r = Math.random().toString(36).slice(2, 7)

  const draft = await createGmailDraftInThread({
    to, 
    from,
    subject: `${r}`, 
    text: `Print the word ${r}`, 
    threadId: null,
    google_refresh_token: google_refresh_token
  })

  const { data } = await sendDraft(draft.id!, google_refresh_token)
  if (!data.threadId) {
    throw new Error('Cant find thread after sending draft.')
  }

  const thread = await getThreadById(data.threadId, google_refresh_token)
  const mail = thread.messages.find((m: any) => m.id === data.id)

  if (!mail) {
    throw new Error('Cant find message in thread after sending draft.')
  }

  const messageId = mail.payload.headers.find((h: any) => h.name.toLowerCase() === 'message-id')?.value
  const threadId = thread.id

  const replies = await Promise.all(
    expectedReplies.map(async (type: string) => {
      return watch(async () => {      
        if (type === 'draft') {
          return checkForDraft(threadId, messageId, google_refresh_token)
        }
        // or type is reply
        return checkForReply(threadId, messageId, google_refresh_token)
      }, 1000)
    })
  )

  // expect all replies to be truthy
  expect(replies.every((r: any) => r)).toBe(true)
}

const from = 'amonecho1@gmail.com'
// this allows us to send emails to getreply, pc or laptop
const emailRoutingTag = process.env.EMAIL_ROUTING_TAG || ''

describe('e2e', () => {
  it.concurrent('should use gmail to hit the reply sequence then check for reply in inbox', async () => {
    const profile: Profile = await getProfileFromEmail(from)
    if (!profile) {
      throw new Error('No profile found')
    }

    await liveGmailTest({
      to: [`reply${emailRoutingTag}@getreply.app`],
      from,
      google_refresh_token: profile.google_refresh_token!,
      expectedReplies: ['reply']
    })
  }, 1000 * 60) // wait 1 minute

  it.concurrent('should use gmail to hit the fastfollowup sequence then check for in inbox', async () => {
    const profile: Profile = await getProfileFromEmail(from)
    if (!profile) {
      throw new Error('No profile found')
    }

    await liveGmailTest({
      to: [`fastfollowup${emailRoutingTag}@getreply.app`],
      from,
      google_refresh_token: profile.google_refresh_token!,
      expectedReplies: ['draft', 'draft']
    })
  }, 1000 * 60) // wait 1 minute

  it.only('should use gmail to hit the collab sequence', async () => {
    const profile: Profile = await getProfileFromEmail(from)
    if (!profile) {
      throw new Error('No profile found')
    }

    await liveGmailTest({
      to: [`collab${emailRoutingTag}@getreply.app`, 'me@eoinmurray.eu'],
      from,
      google_refresh_token: profile.google_refresh_token!,
      expectedReplies: ['reply']
    })
  }, 1000 * 60) // wait 1 minute
})