import getProfileFromEmail from '~/lib/get-profile-from-email'
import { trashThreadById } from '~/lib/google'
import { introText as followupIntroText } from '~/lib/processes/followup'
import { Profile } from '~/lib/types'
import { liveGmailTest, waitForReplies } from '~/tests/utils'

const EMAIL_ROUTING_TAG = process.env.EMAIL_ROUTING_TAG || ''
const TIMEOUT = 1000 * 60 * 2

describe('e2e using gmail', () => {
  let profile: Profile
  let threadIds: string[] = []

  beforeAll(async () => {
    const FROM = process.env.TEST_GMAIL_USER
    if (!FROM) throw new Error('No test gmail user found')
    profile = await getProfileFromEmail(FROM)
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
  }, TIMEOUT)

  it('will test the now@getreply.app sequence', async () => {
    const testName = 'now'
    const to = [`${testName}${EMAIL_ROUTING_TAG}@getreply.app`]
    const { messageId, threadId } = await liveGmailTest({ to })
    const replies = await waitForReplies({
      threadId,
      messageId,
      numberOfExpectedReplies: 1,
    })
    replies.forEach((r: any) => expect(r.snippet).toContain(followupIntroText))
    threadIds.push(threadId)
  }, TIMEOUT)  

  it('should test both now@getreply.app and 30sec@getreply.app', async () => {
    const to = [
      `now${EMAIL_ROUTING_TAG}@getreply.app`,
      `30sec${EMAIL_ROUTING_TAG}@getreply.app`
    ]
    const { messageId, threadId } = await liveGmailTest({ to })
    const replies = await waitForReplies({
      threadId,
      messageId,
      numberOfExpectedReplies: 2,
    })
    replies.forEach((r: any) => expect(r.snippet).toContain(followupIntroText))
    threadIds.push(threadId)
  }, TIMEOUT)

  afterAll(async () => {
    await Promise.all(
      threadIds.map(async (threadId: string) => {
        await trashThreadById(threadId, profile.refresh_token!)
      })
    )
  })
})