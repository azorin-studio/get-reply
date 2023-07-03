import { processIncomingEmail } from "~/bus/engine"
import createTestEmail from "./create-test-email"

describe('bus', () => {
  it('start', async () => {
    const email = createTestEmail({})
    await processIncomingEmail(email)
  })
})