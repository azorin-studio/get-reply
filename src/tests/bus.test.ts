import { processIncomingEmail } from "~/bus/event-list"
import createTestEmail from "./create-test-email"
import { getEventEmitter } from "~/bus/engine"

describe('bus', () => {
  it('start', async () => {
    const randomString = Math.random().toString(36).substring(7)
    const email = createTestEmail({ messageId: `test-${randomString}` })
    console.log('start')
    await processIncomingEmail(email)
  })

  afterAll(async () => {
    console.log('afterAll')
    await getEventEmitter().removeAllListeners()
    await Promise.resolve()
  })
})