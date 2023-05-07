import { daysBetween, getSequenceFromLog, handleCreateDraftEvent, handleGenerateEvent, handleProcessEmailEvent, handleVerifyEvent } from "./cron"
import testEmail from '~/data/test-email.json'
import { IncomingEmail, Log, Profile } from "./types"
import supabaseAdminClient, { getProfileFromEmail } from "./supabase"
import { createGmailDraftInThread, deleteDraft, findThread, makeUnreadInInbox } from "./google"
import { callGPT35Api } from "./chat-gpt"
import { addDays, parseISO } from "date-fns"

jest.mock('./chat-gpt')
jest.mock('./google')

const deleteLog = async (log: Log) => {
  console.log('deleting log', log!.id)
  await supabaseAdminClient
    .from('logs')
    .delete()
    .eq('id', log!.id)
}

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

  
  it('should check if sequence should be sent today', async () => {
    log = await handleProcessEmailEvent(testEmail as IncomingEmail)
    const sequence = await getSequenceFromLog(log)
    
    await Promise.all(sequence?.prompt_list?.map(async (prompt, index) => {
      const days = daysBetween(
        new Date(),
        addDays(parseISO(log?.created_at), prompt.delay)
      )

      if (days === 0) {
        // put generation in draft
      }

      console.log({ days })

      return { a: 1 }
    }))
      
    await deleteLog(log)
  })

  it('should handleVerifyEvent', async () => {
    const logs = await handleVerifyEvent()
    expect(logs.length).toBe(1)
    expect(logs[0].status).toBe('verified')
  })

  it('should handleGenerateEvent', async () => {
    callGPT35Api.mockResolvedValue('follow up 1 text content')
    callGPT35Api.mockResolvedValue('follow up 2 text content')

    const logs = await handleGenerateEvent()
    expect(logs.length).toBe(1)
    expect(logs[0].status).toBe('generated')
  })

  it('should handleCreateDraftEvent', async () => {
    findThread.mockResolvedValue({ id: 'some id' })
    createGmailDraftInThread.mockResolvedValue({ id: 'draft id' })
    makeUnreadInInbox.mockResolvedValue('some response')

    const logs = await handleCreateDraftEvent()
    expect(logs.length).toBe(1)
    expect(logs[0].status).toBe('ready-in-inbox')
  })

  afterAll(async () => {
    if (log) {
      await deleteLog(log)

      if (log.draftId && profile?.google_refresh_token) {
        console.log('deleting draft', log!.draftId)
        await deleteDraft(log!.draftId!, profile.google_refresh_token)
      }
    }    
  })
})  

