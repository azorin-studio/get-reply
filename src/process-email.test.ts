import testEmail from '~/data/test-email.json'
import { processEmail } from './process-email'
import { Profile, type IncomingEmail, Log } from '~/types'
import { getProfileFromEmail, supabaseAdminClient } from './supabase'
import { generateFollowUps } from './chat-gpt'
import { deleteDraft } from './providers/google'

jest.mock('./chat-gpt')

describe('process', () => {
  let log: Log | null = null
  let profile: Profile | null

  // ts-ignore
  generateFollowUps.mockResolvedValue({ 
    followUpEmail1: 'followUpEmail1',
    followUpEmail2: 'followUpEmail2',
  })

  if (testEmail.attachments) {
    delete (testEmail as IncomingEmail).attachments
  }

  beforeAll(async () => {
    profile = await getProfileFromEmail(testEmail.from.address)
    if (!profile) {
      throw new Error(`Test user ${testEmail.from.address} profile not found. Its required for process tests to run.`)
    }
  })

  it('Creates follow ups email and puts in users drafts', async () => {
    log = await processEmail(testEmail as IncomingEmail)    
    expect(log.errorMessage).toBeNull()
    expect(log.status).toBe('ready-in-inbox')
  }, 30000)

  afterAll(async () => {
    if (log) {
      console.log('deleting log', log!.id)
      await supabaseAdminClient
        .from('logs')
        .delete()
        .eq('id', log!.id)

      if (log.draftId && profile?.google_refresh_token) {
        console.log('deleting draft', log!.draftId)
        await deleteDraft(log!.draftId!, profile.google_refresh_token)
      }
    }    
  })
})
