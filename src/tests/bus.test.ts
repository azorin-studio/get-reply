import { processIncomingEmail } from "~/bus/engine"
import createTestEmail from "./create-test-email"
import { startEventEmitter } from "~/bus/engine"
import { EventEmitter } from "stream"
import deleteLogById from "~/supabase/delete-log-by-id"
import supabaseAdminClient from "~/supabase/supabase-admin-client"

import { sendMail } from "../lib/send-mail"
jest.mock('../lib/send-mail', () => ({ sendMail: jest.fn() }))
jest.mock('../lib/chat-gpt', () => ({ callGPT35Api: jest.fn(() => 'test') }))

const awaitDone = async (eventEmitter: EventEmitter): Promise<any> => 
  new Promise((resolve) => {
    console.log(`+ registering event queue/done`)
    eventEmitter.on('queue/done', (data: any) => {
      console.log(`+ recieved event queue/done ${data.log_id}`)
      resolve(data)
    })
  })


describe('bus', () => {
  let eventEmitter: EventEmitter
  let log_id: string

  beforeAll(async () => {
    eventEmitter = await startEventEmitter()
  })

  it('should test email', async () => {    
    const email = createTestEmail()
    await processIncomingEmail(email)

    const data = await awaitDone(eventEmitter)
    log_id = data.log_id
    
    // @ts-ignore
    sendMail.mock.calls.forEach((call: any) => {
      expect(call[0].subject).toEqual(`re: ${email.subject}`)
    })
  }, 20000)

  afterAll(async () => {
    console.log('afterAll')
    await eventEmitter.removeAllListeners()
    await Promise.resolve()
    if (log_id) {
      await deleteLogById(supabaseAdminClient, log_id)
    }
  })
})