import testEmail from '~/data/test-email.json'
import { processEmail } from './process-email'
import { Profile, type IncomingEmail } from '~/types'
import { getProfileFromEmail } from './supabase'

describe('process', () => {
  it('Creates follow ups email and puts in users drafts', async () => {

    const profile: Profile = await getProfileFromEmail(testEmail.from.address)

    if (!profile) {
      throw new Error(`Test user ${testEmail.from.address} profile not found. Its required for process tests to run.`)
    }

    if (testEmail.attachments) {
      delete (testEmail as IncomingEmail).attachments
    }

    const log = await processEmail(testEmail as IncomingEmail)
    console.log(log)
  }, 30000)
})
