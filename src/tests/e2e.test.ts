import { trashThreadById } from '~/lib/google'
import { introText as followupIntroText } from '~/components/emails/followup-reminder'
import { Profile } from '~/supabase/types'
import { getIdFromReply, liveGmailTest, waitForReplies, watch } from '~/tests/utils'
import { deleteLogById, getLogById, getProfileByEmail } from "~/supabase/supabase"
import { supabaseAdminClient } from "~/supabase/server-client"

const EMAIL_ROUTING_TAG = process.env.EMAIL_ROUTING_TAG || ''
const TIMEOUT = 1000 * 60

describe('e2e', () => {  
  let profile: Profile
  let threadIds: string[] = []
  let logIds: string[] = []

  beforeAll(async () => {
    if (!process.env.E2E_TESTS) {
      console.log('E2E_TESTS is not set. Skipping e2e tests')
      throw new Error('E2E_TESTS is not set. Skipping e2e tests')
    }
    if (EMAIL_ROUTING_TAG === '') {
      console.log('EMAIL_ROUTING_TAG is not set. Running e2e on production')
    } else {
      console.log(`EMAIL_ROUTING_TAG is set to ${EMAIL_ROUTING_TAG}. Running e2e on local`)
      // check if local server is on
      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/health`)
      if (res.status !== 200) {
        console.log('Local server is not running, quitting')
        throw new Error('Local server is not running')
      }
    }

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
  // }, TIMEOUT)

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

    const logId = getIdFromReply(replies[0])
    logIds.push(logId)

    const snippets = replies.map((r: any) => r.snippet).join('')
    expect(snippets).toContain('Confirmation from GetReply')
    expect(snippets).toContain(followupIntroText)
    threadIds.push(threadId)
  }, TIMEOUT)

  it('will test cancelling the f+1m@getreply.app', async () => {
    const testName = 'f+1m'
    const to = [`${testName}${EMAIL_ROUTING_TAG}@getreply.app`]
    const { messageId, threadId } = await liveGmailTest({ to })
    const replies = await waitForReplies({
      threadId,
      messageId,
      numberOfExpectedReplies: 1,
    })

    expect(replies).toHaveLength(1)
    const logId = getIdFromReply(replies[0])
    logIds.push(logId)

    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/cancel?log_id=${logId}`)
    const log = await watch(async () => {
      const log = await getLogById(supabaseAdminClient, logId!)
      if (log?.status === 'cancelled') return log
      return null
    }, 1000)
    
    expect(log?.status).toBe('cancelled')
    threadIds.push(threadId)
  }, TIMEOUT)

  it('should test both f+5s@getreply.app and f+15s@getreply.app', async () => {
    const to = [
      `f+5s${EMAIL_ROUTING_TAG}@getreply.app`,
      `f+15s${EMAIL_ROUTING_TAG}@getreply.app`
    ]
    const { messageId, threadId } = await liveGmailTest({ to })
    const replies = await waitForReplies({
      threadId,
      messageId,
      numberOfExpectedReplies: 3,
    })
    expect(replies).toHaveLength(3)
    const logId = getIdFromReply(replies[0])
    logIds.push(logId)
    threadIds.push(threadId)
  }, 2 * TIMEOUT)
  
  it.skip('will test the f+5m@getreply.app', async () => {
    const testName = 'f+5m'
    const to = [`${testName}${EMAIL_ROUTING_TAG}@getreply.app`]
    const { messageId, threadId } = await liveGmailTest({ to })
    const replies = await waitForReplies({
      threadId,
      messageId,
      numberOfExpectedReplies: 2,
    })
    expect(replies).toHaveLength(2)
    expect(replies[0].snippet).toContain('Confirmation from GetReply')
    expect(replies[1].snippet).toContain(followupIntroText)
    const logId = getIdFromReply(replies[0])
    logIds.push(logId)
    threadIds.push(threadId)
  }, 6 * TIMEOUT)

  afterAll(async () => {
    await Promise.all(
      threadIds.map(async (threadId: string) => {
        await trashThreadById(threadId, profile.refresh_token!)
      })
    )

    await Promise.all(
      logIds.map(async (logId: string) => {
        await deleteLogById(supabaseAdminClient, logId)
      })
    )
  })
})
