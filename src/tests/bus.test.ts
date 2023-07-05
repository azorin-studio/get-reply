import processIncomingEmail from "~/bus/process-incoming-email"
import createTestEmail from "./create-test-email"
import { deleteLogById, getLogById } from "~/supabase/supabase"
import { supabaseAdminClient } from "~/supabase/server-client"

import { sendMail } from "../lib/send-mail"
import { watch } from "./utils"
import { LogAlreadyExistsError } from "~/bus/event-list"
jest.mock('../lib/send-mail', () => ({ sendMail: jest.fn() }))
jest.mock('../lib/chat-gpt', () => ({ callGPT35Api: jest.fn(() => 'test') }))

describe('bus', () => {
  const log_ids: string[] = []
  let mockLength = 0

  it('should test email', async () => {    
    const email = createTestEmail()
    const { log_id } = await processIncomingEmail(email)
    log_ids.push(log_id)
    await watch(async () => {
      const log = await getLogById(supabaseAdminClient, log_id)
      console.log(log?.status)
      return log?.status === 'complete'
    }, 100)
    
    // @ts-ignore
    expect(sendMail.mock.calls.length).toEqual(2)
    // @ts-ignore
    sendMail.mock.calls.forEach((call: any) => {
      expect(call[0].subject).toEqual(`re: ${email.subject}`)
    })

    // @ts-ignore
    mockLength = sendMail.mock.calls.length
  }, 20000)

  it('should test two same emails', async () => {    
    const email = createTestEmail()
    const { log_id } = await processIncomingEmail(email)
    log_ids.push(log_id)
    try {
      await processIncomingEmail(email)
    } catch (error: any) {
      expect(error.message).toEqual(LogAlreadyExistsError.message)
    }
    
    await watch(async () => {
      const log = await getLogById(supabaseAdminClient, log_id)
      console.log(log?.status)
      return log?.status === 'complete'
    }, 100)
    
    // @ts-ignore
    expect(sendMail.mock.calls.length).toEqual(mockLength + 2)
    // @ts-ignore
    mockLength = sendMail.mock.calls.length
  }, 20000)

  afterAll(async () => {
    if (log_ids) {
      await Promise.all(log_ids.map(async (log_id) => {
        await deleteLogById(supabaseAdminClient, log_id)
      }))
    }
  })
})