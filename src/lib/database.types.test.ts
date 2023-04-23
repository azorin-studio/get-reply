import { IncomingEmail } from '~/types'
import { Json } from './database.types'

describe('types', () => {
  it('making a Json type', async () => {
    const json: Json = {
      foo: 'bar',
    }

    expect(json).toHaveProperty('foo')
  })

  it('making an IncomingMail type', async () => {
    const testEmail: IncomingEmail = {
      bcc: [{ address: 'bot@getreply.app', name: 'GetReply bot' }],
      cc: [],
      date: '2021-05-01T00:00:00.000Z',
      from: {
        address: 'test@example.com',
        name: 'Example',
      },
      headers: [],
      html: '',
      messageId: '',
      subject: 'Test email',
      to: [{ address: 'example@example.com', name: 'Example' }],
      text: 'Hi there,\n\nI\'m interested in your product. Can you tell me more about it?\n\nThanks,\n\nJohn',
    }

    expect(testEmail.from).toHaveProperty('address')
    expect(testEmail.from.address).toBe('test@example.com')
  })


})
