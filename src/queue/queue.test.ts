import fetch from 'isomorphic-fetch'
import testEmail from '~/data/test-email.json'
import { queue } from '~/queue/queue'

describe('queue', () => {

  it('should hit the api with a test email', async () => {
    testEmail.messageId = `test-${Math.random().toString(36).slice(2, 14)}@getreply.app` 
    const request = await fetch('http://localhost:3000/api/process-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEmail),
    })

    const data = await request.json()
    expect(data).toHaveProperty('id')
  })

  // it('should send an email to trigger the pipeline', async () => {
  //   const profile: Profile = await getProfileFromEmail('amonecho1@gmail.com')
    
  //   const r = Math.random().toString(36).slice(2, 7)

  //   const draft = await createGmailDraftInThread(
  //     [{ address: 'reply@getreply.app', name: '' }], 
  //     { address: 'amonecho1@gmail.com', name: '' },
  //     `Test: ${r}`, 
  //     `Body: ${r}`, 
  //     null,
  //     profile.google_refresh_token!
  //   )

  //   await sendDraft(draft.id!, profile.google_refresh_token!)
  // })

  // it('should check if sequence should be sent today', async () => {
  //   // Important, testEmail must be addressed to test@getreply.app
  //   // in order to have the correct sequence

  //   // three days ago
  //   // testEmail.date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  //   // today
  //   testEmail.date = new Date(Date.now()).toISOString()
  // })

  afterAll(async () => {})
})
