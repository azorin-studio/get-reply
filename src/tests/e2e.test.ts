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

describe('e2e', () => {
  let profile: Profile
  
  beforeAll(async () => {
    profile = await getProfileFromEmail('amonecho1@gmail.com')
    if (!profile) {
      throw new Error('No profile found')
    }
  })

  it('should use gmail to hit the reply sequence then check for response within 5 minutes', async () => {
    const r = Math.random().toString(36).slice(2, 7)

    const draft = await createGmailDraftInThread({
      to: ['reply@getreply.app'], 
      from: 'amonecho1@gmail.com',
      subject: `${r}`, 
      text: `Print the word ${r}`, 
      threadId: null,
      google_refresh_token: profile.google_refresh_token!
    })

    const { data } = await sendDraft(draft.id!, profile.google_refresh_token!)
    if (!data.threadId) {
      throw new Error('Cant find thread after sending draft.')
    }

    const thread = await getThreadById(data.threadId, profile.google_refresh_token!)
    const mail = thread.messages.find((m: any) => m.id === data.id)

    if (!mail) {
      throw new Error('Cant find message in thread after sending draft.')
    }

    const messageId = mail.payload.headers.find((h: any) => h.name.toLowerCase() === 'message-id')?.value
    const threadId = thread.id

    // wait 5 up to minutes for a reply
    let replyMessage: any
    await watch(async () => {
      replyMessage = await checkForReply(threadId, messageId, profile.google_refresh_token!)
      return !!replyMessage
    }, 1000)

    expect(replyMessage).toBeDefined()
    expect(replyMessage?.snippet).toEqual(r)

  }, 1000 * 60) // wait 1 minute


  it.only('should use gmail to hit the fastfollowup sequence then check for draft within 5 minutes', async () => {
    const r = Math.random().toString(36).slice(2, 7)

    const draft = await createGmailDraftInThread({
      to: ['fastfollowup@getreply.app', 'me@eoinmurray.eu'], 
      from: 'amonecho1@gmail.com',
      subject: `${r}`, 
      text: `Print the word ${r}`, 
      threadId: null,
      google_refresh_token: profile.google_refresh_token!
    })

    const { data } = await sendDraft(draft.id!, profile.google_refresh_token!)
    if (!data.threadId) {
      throw new Error('Cant find thread after sending draft.')
    }

    const thread = await getThreadById(data.threadId, profile.google_refresh_token!)
    const mail = thread.messages.find((m: any) => m.id === data.id)

    if (!mail) {
      throw new Error('Cant find message in thread after sending draft.')
    }

    const messageId = mail.payload.headers.find((h: any) => h.name.toLowerCase() === 'message-id')?.value
    const threadId = thread.id
    // const messageId = '<CAG9yPc2mVgZpX10_CKwHvJg-euo3JkJidJnFd87gEU4bimJJvA@mail.gmail.com>'
    // const threadId = '188b135b411ed818'

    // wait 5 up to minutes for a reply
    let draftedMessage: any
    await watch(async () => {
      draftedMessage = await checkForDraft(threadId, messageId, profile.google_refresh_token!)
      return !!draftedMessage
    }, 1000)

    expect(draftedMessage).toBeDefined()
    expect(draftedMessage?.snippet).toContain(r)

  }, 1000 * 60) // wait 1 minute
})
