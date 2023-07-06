import createTestEmail from "./create-test-email"
import { deleteLogById, getLogById } from "~/supabase/supabase"
import { supabaseAdminClient } from "~/supabase/server-client"
import { LogAlreadyExistsError, eventBus } from "~/bus/event-list"
import { awaitStatus, simulateSendEmail } from "./utils"

import { sendMail } from "../lib/send-mail"
jest.mock('../lib/send-mail', () => ({ sendMail: jest.fn() }))
jest.mock('../lib/chat-gpt', () => ({ callGPT35Api: jest.fn(() => 'test') }))

describe('bus', () => {
  const log_ids: string[] = []

  it('should test instant email', async () => {    
    const email = createTestEmail()
    const { log_id } = await simulateSendEmail(email)
    log_ids.push(log_id)
    await awaitStatus(log_id)
  }, 30000)

  it.failing('should fail f+1m email', async () => {    
    const email = createTestEmail({
      toAddresses: ['f+1m@getreply.app']
    })
    const { log_id } = await simulateSendEmail(email)
    log_ids.push(log_id)
    await awaitStatus(log_id)
  }, 30000)

  it('should pass f+1m email', async () => {  
    if (process.env.SERVER_URL) {
      console.log('Skipping test because SERVER_URL is set')
      return
    }

    const email = createTestEmail({ toAddresses: ['f+1m@getreply.app'] })
    const { log_id } = await simulateSendEmail(email)
    log_ids.push(log_id)

    jest
      .useFakeTimers()
      .setSystemTime(new Date('2024-01-01'))
    await eventBus.allReminders()
    jest.useRealTimers()
    await awaitStatus(log_id)
  })

  it('should test two same emails', async () => {    
    const email = createTestEmail()
    const { log_id } = await simulateSendEmail(email)
    log_ids.push(log_id)
    try {
      await simulateSendEmail(email)
    } catch (error: any) {
      expect(error.message).toEqual(LogAlreadyExistsError.message)
    }
    await awaitStatus(log_id)
  }, 30000)

  afterAll(async () => {
    if (log_ids) {
      await Promise.all(log_ids.map(async (log_id) => {
        await deleteLogById(supabaseAdminClient, log_id)
      }))
    }
  })
})