import { trashThreadById } from '~/lib/google'
import { introText as followupIntroText } from '~/components/emails/followup-reminder'
import { Profile } from '~/supabase/types'
import { liveGmailTest, waitForReplies } from '~/tests/utils'
import { getProfileByEmail, supabaseAdminClient } from "~/supabase/supabase"


const EMAIL_ROUTING_TAG = process.env.EMAIL_ROUTING_TAG || ''
const ONE_MINUTE = 1000 * 60 * 1

describe.skip('e2e', () => {
  let profile: Profile
  let threadIds: string[] = []

  beforeAll(async () => {
    const FROM = process.env.TEST_GMAIL_USER
    if (!FROM) throw new Error('No test gmail user found')
    profile = await getProfileByEmail(supabaseAdminClient, FROM)
    if (!profile) throw new Error('No profile found')
  })

  // it('should test not found', async () => {
  //   const testName = '404'
  //   const to = [`${testName}${EMAIL_ROUTING_TAG}@getreply.app`]
  //   const { messageId, threadId } = await liveGmailTest({ to })
  //   const replies = await waitForReplies({
  //     threadId,
  //     messageId,
  //     numberOfExpectedReplies: 2,
  //   })
  //   const s = replies.map((r: any) => r.snippet).join('')
  //   expect(s).toContain('GetReply Prompt not found')
  //   threadIds.push(threadId)
  // }, ONE_MINUTE)

  it.only('will test the f+5s@getreply.app', async () => {
    const testName = 'f+5s'
    const to = [`${testName}${EMAIL_ROUTING_TAG}@getreply.app`]
    const { messageId, threadId } = await liveGmailTest({ to })
    const replies = await waitForReplies({
      threadId,
      messageId,
      numberOfExpectedReplies: 2,
    })
    expect(replies).toHaveLength(2)
    const snippets = replies.map((r: any) => r.snippet).join('')
    expect(snippets).toContain('Confirmation from GetReply')
    expect(snippets).toContain(followupIntroText)
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