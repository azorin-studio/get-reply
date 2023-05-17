import sendMail from "./send-mail"

describe('mail:send', () => {
  it('should send an email', async () => {
    const reply = await sendMail({
      from: 'reply@getreply.app',
      to: 'me@eoinmurray.eu',
      subject: 'Test email',
      textBody: 'This is a test email'
    })

    expect(reply.Message).toBe('OK')
  })
})
