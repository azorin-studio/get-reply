import { introText as followupIntroText } from '~/inngest/processes/followup'
import { liveGmailTest, waitForReplies } from '~/tests/utils'

const EMAIL_ROUTING_TAG = process.env.EMAIL_ROUTING_TAG || ''

describe('e2e will use gmail to send email to GetReply then poll gmail for responses', () => {

  it.only('will test sequence not found', async () => {
    const testName = '404'

    const to = [
      `${testName}${EMAIL_ROUTING_TAG}@getreply.app`
    ]

    const { messageId, threadId } = await liveGmailTest({ to })
    const replies = await waitForReplies({
      threadId,
      messageId,
      numberOfExpectedReplies: 1,
    })

    replies.forEach((r: any) => expect(r.snippet).toContain('Error from GetReply'))
  }, 1000 * 60 * 1)

  it.concurrent('0min', async () => {
    const testName = '0min'
    const to = [
      `${testName}${EMAIL_ROUTING_TAG}@getreply.app`
    ]

    const { messageId, threadId } = await liveGmailTest({ to })
    const replies = await waitForReplies({
      threadId,
      messageId,
      numberOfExpectedReplies: 1,
    })

    replies.forEach((r: any) => expect(r.snippet).toContain(followupIntroText))
  }, 1000 * 60 * 1)
})