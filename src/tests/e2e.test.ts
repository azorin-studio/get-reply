import getProfileFromEmail from '~/supabase/get-profile-from-email'
import { trashThreadById } from '~/lib/google'
import { introText as followupIntroText } from '~/components/emails/followup-reminder'
import { Profile } from '~/supabase/types'
import { liveGmailTest, waitForReplies } from '~/tests/utils'
import supabaseAdminClient from '~/supabase/supabase-admin-client'

const EMAIL_ROUTING_TAG = process.env.EMAIL_ROUTING_TAG || ''
const ONE_MINUTE = 1000 * 60 * 1

describe('e2e using gmail', () => {
  let profile: Profile
  let threadIds: string[] = []

  beforeAll(async () => {
    const FROM = process.env.TEST_GMAIL_USER
    if (!FROM) throw new Error('No test gmail user found')
    profile = await getProfileFromEmail(supabaseAdminClient, FROM)
    if (!profile) throw new Error('No profile found')
  })  

  it('should test sequence not found', async () => {
    const testName = '404'
    const to = [`${testName}${EMAIL_ROUTING_TAG}@getreply.app`]
    const { messageId, threadId } = await liveGmailTest({ to })
    const replies = await waitForReplies({
      threadId,
      messageId,
      numberOfExpectedReplies: 1,
    })
    replies.forEach((r: any) => expect(r.snippet).toContain('GetReply Sequence not found'))
    threadIds.push(threadId)
  }, 1 * ONE_MINUTE)

  it('will test the f+30s@getreply.app sequence', async () => {
    const testName = 'f+30s'
    const to = [`${testName}${EMAIL_ROUTING_TAG}@getreply.app`]
    console.log('to', to)
    const { messageId, threadId } = await liveGmailTest({ to })
    const replies = await waitForReplies({
      threadId,
      messageId,
      numberOfExpectedReplies: 2,
    })
    expect(replies).toHaveLength(2)
    expect(replies[0].snippet).toContain('Confirmation from GetReply')
    expect(replies[1].snippet).toContain(followupIntroText)
    threadIds.push(threadId)
  }, 2 * ONE_MINUTE)

  it('will test the f+5m@getreply.app sequence', async () => {
    if (!process.env.LONG_TESTS) {
      console.log('Skipping long test. Set LONG_TESTS=true to run this test.')
      return
    } {
      console.log('Detected LONG_TESTS=true. Running long test.')
    }
    const testName = 'f+5m'
    const to = [`${testName}${EMAIL_ROUTING_TAG}@getreply.app`]
    console.log('to', to)
    const { messageId, threadId } = await liveGmailTest({ to })
    const replies = await waitForReplies({
      threadId,
      messageId,
      numberOfExpectedReplies: 2,
    })
    expect(replies).toHaveLength(2)
    expect(replies[0].snippet).toContain('Confirmation from GetReply')
    expect(replies[1].snippet).toContain(followupIntroText)
    threadIds.push(threadId)
  }, 6 * ONE_MINUTE)


  it('should test both f+30s@getreply.app and f+15s@getreply.app', async () => {
    const to = [
      `f+30s${EMAIL_ROUTING_TAG}@getreply.app`,
      `f+15s${EMAIL_ROUTING_TAG}@getreply.app`
    ]
    const { messageId, threadId } = await liveGmailTest({ to })
    const replies = await waitForReplies({
      threadId,
      messageId,
      numberOfExpectedReplies: 3,
    })
    expect(replies).toHaveLength(3)
    threadIds.push(threadId)
  }, 2 * ONE_MINUTE)
  
  afterAll(async () => {
    await Promise.all(
      threadIds.map(async (threadId: string) => {
        await trashThreadById(threadId, profile.refresh_token!)
      })
    )
  })
})