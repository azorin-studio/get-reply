import fetch from 'isomorphic-fetch'
import testEmail from '~/data/test-email.json'
import getProfileFromEmail from '~/db-admin/get-profile-from-email'
import { Profile } from '~/db-admin/types'
import { createGmailDraftInThread, sendDraft } from '~/google'

describe('queue', () => {
  it('should directly reply to the email', async () => {
    testEmail.messageId = `test-${Math.random().toString(36).slice(2, 14)}@getreply.app` 
    testEmail.date = new Date(Date.now()).toISOString()
    testEmail.to = [
      {
        "address": "reply@getreply.app",
        "name": ""
      }
    ]
    const request = await fetch('http://localhost:3000/api/process-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEmail),
    })

    const data = await request.json()
    expect(data).toHaveProperty('success')
  }, 10000)

  it('should draft follow immediately', async () => {
    testEmail.messageId = `test-${Math.random().toString(36).slice(2, 14)}@getreply.app` 
    testEmail.date = new Date(Date.now()).toISOString()
    testEmail.to = [
      {
        "address": "test@getreply.app",
        "name": ""
      }
    ]

    const request = await fetch('http://localhost:3000/api/process-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEmail),
    })

    const data = await request.json()
    expect(data).toHaveProperty('success')
  }, 10000)

  it('should draft follow ups after 3 and 6 days', async () => {
    testEmail.messageId = `test-${Math.random().toString(36).slice(2, 14)}@getreply.app` 
    testEmail.date = new Date(Date.now()).toISOString()
    testEmail.to = [
      {
        "address": "followup@getreply.app",
        "name": ""
      }
    ]

    const request = await fetch('http://localhost:3000/api/process-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEmail),
    })

    const data = await request.json()
    expect(data).toHaveProperty('success')
  }, 10000)

  it.only('should send an email using gmail', async () => {
    const profile: Profile = await getProfileFromEmail('amonecho1@gmail.com')
    const r = Math.random().toString(36).slice(2, 7)
    const draft = await createGmailDraftInThread(
      [{ address: 'followup@getreply.app', name: '' }], 
      { address: 'amonecho1@gmail.com', name: '' },
      `Test: ${r}`, 
      `Body: Write me a haiku!`, 
      null,
      profile.google_refresh_token!
    )
    await sendDraft(draft.id!, profile.google_refresh_token!)
  })

})
