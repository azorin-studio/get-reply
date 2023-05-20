import getProfileFromEmail from "./db/get-profile-from-email"
import { Profile } from "./db/types"
import { createGmailDraftInThread, sendDraft } from "./google"

describe('gmail:trigger', () => {
  it('should send an email to trigger the pipeline', async () => {
    const profile: Profile = await getProfileFromEmail('amonecho1@gmail.com')
    
    const r = Math.random().toString(36).slice(2, 7)

    const draft = await createGmailDraftInThread(
      [{ address: 'reply@getreply.app', name: '' }], 
      { address: 'amonecho1@gmail.com', name: '' },
      `Test: ${r}`, 
      `Body: ${r}`, 
      null,
      profile.google_refresh_token!
    )

    const sent = await sendDraft(draft.id!, profile.google_refresh_token!)
    // console.log({ draft, sent })
  })
})
