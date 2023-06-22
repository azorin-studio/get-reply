import { introText as followupIntroText } from '~/inngest/processes/followup'
import { liveGmailTest, waitForReplies } from '~/tests/utils'


const EMAIL_ROUTING_TAG = process.env.EMAIL_ROUTING_TAG || ''


describe('e2e using gmail', () => {


  it.concurrent('should test sequence not found', async () => {
    const testName = '404'
    const to = [`${testName}${EMAIL_ROUTING_TAG}@getreply.app`]
    const { messageId, threadId } = await liveGmailTest({ to })
    const replies = await waitForReplies({
      threadId,
      messageId,
      numberOfExpectedReplies: 1,
    })
    replies.forEach((r: any) => expect(r.snippet).toContain('GetReply Sequence not found'))
  }, 1000 * 60 * 1)


  it.concurrent('will test the now@getreply.app sequence', async () => {
    const testName = 'now'
    const to = [`${testName}${EMAIL_ROUTING_TAG}@getreply.app`]
    const { messageId, threadId } = await liveGmailTest({ to })
    const replies = await waitForReplies({
      threadId,
      messageId,
      numberOfExpectedReplies: 1,
    })
    replies.forEach((r: any) => expect(r.snippet).toContain(followupIntroText))
  }, 1000 * 60 * 1)

  
  it.concurrent('should test both now@getreply.app and 24seconds@getreply.app', async () => {
    const to = [
      `now${EMAIL_ROUTING_TAG}@getreply.app`,
      `24seconds${EMAIL_ROUTING_TAG}@getreply.app`,

    ]
    const { messageId, threadId } = await liveGmailTest({ to })
    const replies = await waitForReplies({
      threadId,
      messageId,
      numberOfExpectedReplies: 2,
    })
    replies.forEach((r: any) => expect(r.snippet).toContain(followupIntroText))
  }, 1000 * 60 * 1)


})