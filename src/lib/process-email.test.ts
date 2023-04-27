import testEmail from '~/data/test-email.json'
import { processEmail } from './process-email'
import { Profile, type IncomingEmail, Log } from '~/types'
import { getProfileFromEmail, supabaseAdminClient } from './supabase'
import { generateFollowUps } from './chat-gpt'

jest.mock('./chat-gpt')

describe('process', () => {
  let log: Log | null = null

  it('Creates follow ups email and puts in users drafts', async () => {
    // ts-ignore
    generateFollowUps.mockResolvedValue({ 
      followUpEmail1: 'followUpEmail1',
      followUpEmail2: 'followUpEmail2',
    })
    
    const profile: Profile = await getProfileFromEmail(testEmail.from.address)

    if (!profile) {
      throw new Error(`Test user ${testEmail.from.address} profile not found. Its required for process tests to run.`)
    }

    if (testEmail.attachments) {
      delete (testEmail as IncomingEmail).attachments
    }

    log = await processEmail(testEmail as IncomingEmail)    
    expect(log.errorMessage).toBeNull()
    expect(log.status).toBe('drafted')
  }, 30000)

  afterAll(async () => {
    if (!log){
      return 
    }

    console.log('deleting log', log.id)
    await supabaseAdminClient
      .from('logs')
      .delete()
      .eq('id', log.id)
  })
})
