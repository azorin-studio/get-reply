import { callGPT35Api } from "~/chat-gpt"
import { handleGenerateEvent, handleProcessEmailEvent, handleVerifyEvent } from "~/cron/cron"
import createDraftAndNotify from '~/cron/draft-event'
import testEmail from '~/data/test-email.json'
import appendToLog from "~/db/append-to-log"
import getProfileFromEmail from "~/db/get-profile-from-email"
import supabaseAdminClient from "~/db/server-admin-client"
import { IncomingEmail, Log, Profile } from "~/db/types"
import { deleteDraft } from "~/google"


jest.mock('../chat-gpt')

const deleteLog = async (log: Log) => {
  await supabaseAdminClient
    .from('logs')
    .delete()
    .eq('id', log!.id)
}

const cleanup = async (log: Log, google_refresh_token: string | null | undefined) => {
  await deleteLog(log)

  if (log.draftIds && google_refresh_token) {
    console.log('deleting drafts', log.draftIds)
    await Promise.all(log.draftIds.map(async (draftId: string) => {
      try {
        await deleteDraft(draftId!, google_refresh_token)
      } catch (error) {
        console.log('error deleting draft', error)
      }
      
      return 
    }))
  }
}

describe('cron:dates', () => {
  let testLog: Log | null = null
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

  it('should check if sequence should be sent today', async () => {
    // Important, testEmail must be addressed to test@getreply.app
    // in order to have the correct sequence

    // three days ago
    // testEmail.date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    // today
    testEmail.date = new Date(Date.now()).toISOString()

    testLog = await handleProcessEmailEvent(testEmail as IncomingEmail)

    testLog = await appendToLog(testLog, {
      generations: ['g1', 'g2']
    })

    // set the logs date to three days from now in order to make a draft
    testLog = await createDraftAndNotify(testLog)    
    expect(testLog.errorMessage).toBe(null)
    expect(testLog.threadId).toBeDefined()
  })

  afterAll(async () => {
    if (!testLog) return
    await cleanup(testLog, profile?.google_refresh_token)
  })
})

describe('cron', () => {
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

  it('should handleProcessEmailEvent', async () => {
    log = await handleProcessEmailEvent(testEmail as IncomingEmail)
    expect(log.status).toBe('pending')
  })
  
  it('should handleVerifyEvent', async () => {
    const logs = await handleVerifyEvent()
    expect(logs.length).toBe(1)
    expect(logs[0].errorMessage).toBe(null)
    expect(logs[0].status).toBe('verified')
  })

  it('should handleGenerateEvent', async () => {
    callGPT35Api.mockResolvedValue('follow up 1 text content')
    callGPT35Api.mockResolvedValue('follow up 2 text content')

    const logs = await handleGenerateEvent()

    // this can fail if the about 'should handleVerifyEvent' test fails
    expect(logs.length).toBe(1)
    expect(logs[0].errorMessage).toBe(null)
    expect(logs[0].status).toBe('generated')
  })

  afterAll(async () => {
    if (!log) {
      return 
    }
    await cleanup(log, profile?.google_refresh_token)    
  })
})  
