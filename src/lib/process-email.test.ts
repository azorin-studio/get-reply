import { processEmail } from './process-email'

describe('Email', () => {
  const sampleEmail = 'Hi there Eoin,\n\nI\'m interested in your product. Can you tell me more about it?\n\nThanks,\n\nJohn';

  it('Creates follow ups email and puts in users drafts', async () => {
    console.log(1)
    await processEmail('me@eoinmurray.eu', 'Sample email from Jest!', sampleEmail)
    console.log(2)
  })
})
