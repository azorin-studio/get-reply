import createTestEmail from "./create-test-email"
import { cancelLogAndActionByLogId, deleteLogById, getActionByKey, getActionsByKey, getLogByKey } from "~/supabase/supabase"
import { supabaseAdminClient } from "~/supabase/server-client"
import { LogAlreadyExistsError, eventBus } from "~/bus/event-list"
import { awaitStatus, simulateSendEmail } from "./utils"

import { sendMail } from "../lib/send-mail"

jest.mock('../lib/send-mail', () => ({ sendMail: jest.fn() }))
jest.mock('../lib/chat-gpt', () => ({ callGPT35Api: jest.fn(() => 'test') }))

const SERVER_URL = process.env.SERVER_URL

describe('bus', () => {
  const log_ids: string[] = []
  
  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(async () => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('should test instant email', async () => {    
    const email = createTestEmail()
    const { log_id } = await simulateSendEmail(email)
    log_ids.push(log_id)
    await awaitStatus(log_id)

    if (!SERVER_URL) {
      // @ts-ignore
      expect(sendMail.mock.calls).toHaveLength(2)
      // @ts-ignore
      sendMail.mock.calls.forEach((call: any) => {
        expect(call[0].subject).toEqual(`re: ${email.subject}`)
      })
    }
  }, 30000)

  it('should test not found email', async () => {    
    const email = createTestEmail({ 
      toAddresses: ['f@getreply.app', 'mistake@getreply.app']
    })
    const { log_id } = await simulateSendEmail(email)
    log_ids.push(log_id)
    await awaitStatus(log_id, 'error')

    if (!SERVER_URL) {
      // @ts-ignore
      expect(sendMail.mock.calls).toHaveLength(2)
      // @ts-ignore
      sendMail.mock.calls.forEach((call: any) => {
        expect(call[0].subject).toEqual(`re: ${email.subject}`)
      })
    }

    const actions = await getActionsByKey(supabaseAdminClient, 'log_id', log_id)
    expect(actions).toHaveLength(0)
  }, 30000)

  it('should pass f+1m email', async () => {
    if (process.env.SERVER_URL) {
      console.log('Skipping test because SERVER_URL is set')
      return
    }

    const email = createTestEmail({ toAddresses: ['f+1m@getreply.app'] })
    const { log_id } = await simulateSendEmail(email)
    log_ids.push(log_id)

    if (!SERVER_URL) {
      // it should have only sent the confirmation email
      // @ts-ignore
      expect(sendMail.mock.calls).toHaveLength(1)
      // @ts-ignore
      sendMail.mock.calls.forEach((call: any) => {
        expect(call[0].subject).toEqual(`re: ${email.subject}`)
      })
    }

    jest
      .useFakeTimers()
      .setSystemTime(new Date('2040-01-01'))
    await eventBus.allReminders()
    if (!SERVER_URL) {
      // it should have only sent the confirmation email
      // @ts-ignore
      expect(sendMail.mock.calls).toHaveLength(2)
      // @ts-ignore
      sendMail.mock.calls.forEach((call: any) => {
        expect(call[0].subject).toEqual(`re: ${email.subject}`)
      })
    }
    jest.useRealTimers()
    await awaitStatus(log_id)
  })

  it('should pass f+30m and f+2h email', async () => {
    if (process.env.SERVER_URL) {
      console.log('Skipping test because SERVER_URL is set')
      return
    }

    const email = createTestEmail({ 
      toAddresses: [
        'f+30m@getreply.app',
        'f+2h@getreply.app',
        'other@example.com'
      ] 
    })
    const { log_id } = await simulateSendEmail(email)
    log_ids.push(log_id)

    if (!SERVER_URL) {
      // it should have only sent the confirmation email
      // @ts-ignore
      expect(sendMail.mock.calls).toHaveLength(1)
      // @ts-ignore
      sendMail.mock.calls.forEach((call: any) => {
        expect(call[0].subject).toEqual(`re: ${email.subject}`)
      })
    }

    const now = new Date()
    now.setHours(now.getHours() + 1)

    jest
      .useFakeTimers()
      .setSystemTime(now)

    await eventBus.allReminders()

    if (!SERVER_URL) {
      // it should have only sent the confirmation email
      // @ts-ignore
      expect(sendMail.mock.calls).toHaveLength(2)
      // @ts-ignore
      sendMail.mock.calls.forEach((call: any) => {
        expect(call[0].subject).toEqual(`re: ${email.subject}`)
      })
    }

    jest
      .setSystemTime(new Date('2040-01-01'))

      await eventBus.allReminders()

      if (!SERVER_URL) {
        // it should have only sent the confirmation email
        // @ts-ignore
        expect(sendMail.mock.calls).toHaveLength(3)
        // @ts-ignore
        sendMail.mock.calls.forEach((call: any) => {
          expect(call[0].subject).toEqual(`re: ${email.subject}`)
        })
      }
  

    jest.useRealTimers()
    await awaitStatus(log_id)
  })

  it('should cancel f+1m email', async () => {
    if (process.env.SERVER_URL) {
      console.log('Skipping test because SERVER_URL is set')
      return
    }

    const email = createTestEmail({ toAddresses: ['f+1m@getreply.app'] })
    const { log_id } = await simulateSendEmail(email)
    
    log_ids.push(log_id)
    await cancelLogAndActionByLogId(supabaseAdminClient, log_id)

    jest
      .useFakeTimers()
      .setSystemTime(new Date('2040-01-01'))

    await eventBus.allReminders()
    if (!SERVER_URL) {
      // it should have only sent the confirmation email
      // @ts-ignore
      expect(sendMail.mock.calls).toHaveLength(1)
    }

    const log = await getLogByKey(supabaseAdminClient, 'id', log_id)
    expect(log).not.toBe(null)
    expect(log!.status).toBe('cancelled')
    const action = await getActionByKey(supabaseAdminClient, 'log_id', log_id)
    expect(action).not.toBe(null)
    expect(action!.status).toBe('cancelled')
  }, 10000)

  it('should test two of same emails and throw error for the second one', async () => {    
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