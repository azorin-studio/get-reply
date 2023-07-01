import getProfileFromEmail from '~/supabase/get-profile-from-email'
import { trashThreadById } from '~/lib/google'
import { Profile } from '~/supabase/types'
import supabaseAdminClient from '~/supabase/supabase-admin-client'
import { startTestServer, stopTestServer } from "./start-test-servers"
import { liveGmailTest, waitForReplies } from "./utils"
import { introText as followupIntroText } from '~/components/emails/followup-reminder'

const EMAIL_ROUTING_TAG = process.env.EMAIL_ROUTING_TAG || ''
const ONE_MINUTE = 1000 * 60 * 1

describe('e2e no server', () => {
  let inngest: any
  let next: any
  let profile: Profile
  let threadIds: string[] = []

  beforeAll(async () => {
    const FROM = process.env.TEST_GMAIL_USER
    if (!FROM) throw new Error('No test gmail user found')
    profile = await getProfileFromEmail(supabaseAdminClient, FROM)
    if (!profile) throw new Error('No profile found')

    if (process.env.START_SERVERS) {
      console.log('Starting servers')
      inngest = await startTestServer('npm', ['run', 'dev:inngest'], false)
      next = await startTestServer('npm', ['run', 'dev:next'])
    }
  })

  it('will test the f+5s@getreply.app', async () => {
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

    if (process.env.START_SERVERS) {
      console.log('Stopping servers')
      await stopTestServer(inngest)
      await stopTestServer(next)
    }
  }, 10000)
})