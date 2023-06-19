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

const from = 'me@eoinmurray.eu'
const emailRoutingTag = process.env.EMAIL_ROUTING_TAG || ''

describe('e2e will use gmail to send email to GetReply then poll gmail for responses', () => {
  it.concurrent('reply', async () => {
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
  }, 1000 * 60 * 2)

  it.concurrent('fastfollowup', async () => {
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
  }, 1000 * 60)

  it.concurrent('24seconds', async () => {
    const profile: Profile = await getProfileFromEmail(from)
    if (!profile) throw new Error('No profile found')

    const { messageId, threadId } = await liveGmailTest({
      to: [`24seconds${emailRoutingTag}@getreply.app`],
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
  }, 1000 * 60 * 2)

  it.concurrent('1minute', async () => {
    const profile: Profile = await getProfileFromEmail(from)
    if (!profile) throw new Error('No profile found')

    const { messageId, threadId } = await liveGmailTest({
      to: [`1minute${emailRoutingTag}@getreply.app`],
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
  }, 1000 * 60 * 2)

  it.concurrent('5minutes', async () => {
    const profile: Profile = await getProfileFromEmail(from)
    if (!profile) throw new Error('No profile found')

    const { messageId, threadId } = await liveGmailTest({
      to: [`5minutes${emailRoutingTag}@getreply.app`],
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
  }, 1000 * 60 * 7)

  it.skip('24minutes', async () => {
    const profile: Profile = await getProfileFromEmail(from)
    if (!profile) throw new Error('No profile found')

    const { messageId, threadId } = await liveGmailTest({
      to: [`24minutes${emailRoutingTag}@getreply.app`],
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
  }, 1000 * 60 * 30) 

  it.skip('1hour', async () => {
    const profile: Profile = await getProfileFromEmail(from)
    if (!profile) throw new Error('No profile found')

    const { messageId, threadId } = await liveGmailTest({
      to: [`1hour${emailRoutingTag}@getreply.app`],
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
  }, 1000 * 60 * 65)
})