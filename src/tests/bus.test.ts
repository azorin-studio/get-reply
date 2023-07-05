import { processIncomingEmail } from "~/bus/engine"
import createTestEmail from "./create-test-email"
import { getEventEmitter } from "~/bus/engine"
import { EventEmitter } from "stream"
import { deleteLogById } from "~/supabase/supabase"
import { supabaseAdminClient } from "~/supabase/server-client"


import { sendMail } from "../lib/send-mail"
jest.mock('../lib/send-mail', () => ({ sendMail: jest.fn() }))
jest.mock('../lib/chat-gpt', () => ({ callGPT35Api: jest.fn(() => 'test') }))

if (process.env.INNGEST_EVENT_KEY) {
  console.log('INNGEST_EVENT_KEY is set. Running bus tests with inngest.')
} else {
  console.log('INNGEST_EVENT_KEY is NOT set. Running bus tests with EventEmitter.')
}

const awaitDone = async (eventEmitter: EventEmitter): Promise<any> => 
  new Promise((resolve) => {
    eventEmitter.on('queue/done', (data: any) => {
      console.log(`+ recieved event queue/done ${data.log_id}`)
      resolve(data)
    })
  })

describe('bus', () => {
  const eventEmitter: EventEmitter = getEventEmitter()
  let log_id: string
  let mockLength = 0

  it('should test email', async () => {    
    const email = createTestEmail()
    await processIncomingEmail(email)

    const data = await awaitDone(eventEmitter)
    log_id = data.log_id
    
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
    await processIncomingEmail(email)
    await processIncomingEmail(email)

    const data = await awaitDone(eventEmitter)
    log_id = data.log_id
    
    // @ts-ignore
    expect(sendMail.mock.calls.length).toEqual(mockLength + 2)
    // @ts-ignore
    mockLength = sendMail.mock.calls.length
  }, 20000)

  afterAll(async () => {
    console.log('afterAll')
    eventEmitter.removeAllListeners()
    await Promise.resolve()
    if (log_id) {
      await deleteLogById(supabaseAdminClient, log_id)
    }
  })
})