import { processEmail } from './process-email'
import { type IncomingEmail } from '~/types'

describe('process', () => {
  const sampleEmail = 'Hi there Eoin,\n\nI\'m interested in your product. Can you tell me more about it?\n\nThanks,\n\nJohn';

  it('Creates follow ups email and puts in users drafts', async () => {
    const testEmail: IncomingEmail = {
      bcc: [{ address: 'bot@getreply.app', name: 'GetReply bot' }],
      cc: [],
      date: '2021-05-01T00:00:00.000Z',
      from: {
        address: 'amonecho1@gmail.com',
        name: 'Amonecho',
      },
      headers: [],
      html: '',
      messageId: '',
      subject: 'Test email',
      text: sampleEmail,
      to: [{ address: 'me@eoinmurray.eu', name: 'Eoin Murray' }]
    }

    const log = await processEmail(testEmail)
    console.log(log)
  }, 30000)
})
