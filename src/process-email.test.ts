import testEmail from '~/data/test-email.json'
import { processEmail } from './process-email'
import { Profile, type IncomingEmail, Log } from '~/types'
import { getProfileFromEmail, supabaseAdminClient } from './supabase'
import { callGPT35Api } from './chat-gpt'
import { deleteDraft } from './providers/google'

jest.mock('./chat-gpt')

describe('process', () => {
  let log: Log | null = null
  let profile: Profile | null

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
    // ts-ignore
    callGPT35Api.mockResolvedValue('follow up 1 text content')
    callGPT35Api.mockResolvedValue('follow up 2 text content')

    log = await processEmail(testEmail as IncomingEmail)    
    expect(log.errorMessage).toBeNull()
    expect(log.status).toBe('ready-in-inbox')
    expect(log.prompts).toHaveLength(2)
    expect(log.generations).toHaveLength(2)
    // console.log(JSON.stringify(log, null, 2))
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
