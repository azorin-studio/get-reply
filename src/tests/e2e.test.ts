import getProfileFromEmail from '~/supabase/get-profile-from-email'
import { trashThreadById } from '~/lib/google'
import { introText as followupIntroText } from '~/components/emails/followup-reminder'
import { Profile } from '~/supabase/types'
import { liveGmailTest, waitForReplies, watch } from '~/tests/utils'
import supabaseAdminClient from '~/supabase/supabase-admin-client'
import parse from 'node-html-parser'
import getLogById from '~/supabase/get-log-by-id'

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

  it('should test not found', async () => {
    const testName = '404'
    const to = [`${testName}${EMAIL_ROUTING_TAG}@getreply.app`]
    const { messageId, threadId } = await liveGmailTest({ to })
    const replies = await waitForReplies({
      threadId,
      messageId,
      numberOfExpectedReplies: 2,
    })
    const s = replies.map((r: any) => r.snippet).join('')
    expect(s).toContain('GetReply Prompt not found')
    threadIds.push(threadId)
  }, ONE_MINUTE)

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
    const body = replies[0].payload.body
    const decodedBody = Buffer.from(body.data, 'base64').toString()
    const root = parse(decodedBody)
    const logUrl = root.querySelector('a')?.getAttribute('href')
    const logId = logUrl?.replace('https://getreply.app/logs/', '')
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/cancel?log_id=${logId}`)
    const log = await watch(async () => {
      const log = await getLogById(supabaseAdminClient, logId!)
      if (log?.status === 'cancelled') return log
      return null
    }, 1000)
    
    expect(log?.status).toBe('cancelled')
    threadIds.push(threadId)
  }, ONE_MINUTE)

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
    threadIds.push(threadId)
  }, 2 * ONE_MINUTE)
  
  it('will test the f+5m@getreply.app', async () => {
    if (!process.env.LONG_TESTS) {
      console.log('Skipping long test. Set LONG_TESTS=true to run this test.')
      return
    } else {
      console.log('Detected LONG_TESTS=true. Running long test.')
    }
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
    threadIds.push(threadId)
  }, 6 * ONE_MINUTE)

  afterAll(async () => {
    await Promise.all(
      threadIds.map(async (threadId: string) => {
        await trashThreadById(threadId, profile.refresh_token!)
      })
    )
  })
})