import sendMail from "./send-mail"

describe('mail:send', () => {
  it('should send an email', async () => {
    const r = Math.random().toString(36).slice(2, 7)
    const reply = await sendMail({
      from: 'reply@getreply.app',
      to: 'amonecho1@gmail.com',
      subject: `Test: qwfwefq23`,
      textBody: `Res: qwfwefq23`
    })

    expect(reply.Message).toBe('OK')
  })
})
