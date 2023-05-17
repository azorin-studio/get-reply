import sendMail from "./send-mail"

describe('mail:send', () => {
  it('should send an email', async () => {
    await sendMail()
  })
})
