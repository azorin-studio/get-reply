import processIncomingEmail from "~/bus/process-incoming-email"
import createTestEmail from "./create-test-email"
import { deleteLogById } from "~/supabase/supabase"
import { supabaseAdminClient } from "~/supabase/server-client"
import { sendMail } from "../lib/send-mail"

jest.mock('../lib/send-mail', () => ({ sendMail: jest.fn() }))
jest.mock('../lib/chat-gpt', () => ({ callGPT35Api: jest.fn(() => 'test') }))

const SERVER_URL = process.env.SERVER_URL

if (SERVER_URL) {
  console.log(`SERVER_URL: ${SERVER_URL}`)
} else {
  console.log('SERVER_URL: false')
}

const simulateSendEmail = async (email: any) => {
  if (!SERVER_URL) return await processIncomingEmail(email)
  const re = await fetch(SERVER_URL + '/api/process-email', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(email)
  })
  if (!re.ok) {
    throw new Error(`Failed to send email: ${re.status} ${re.statusText}`)
  }
  const json = await re.json()
  if (json.error) {
    throw new Error(json.error)
  }
  return json
}

describe('bus', () => {
  const log_ids: string[] = []
  let mockLength = 0

  it.only('should test email', async () => {    
    const email = createTestEmail()
    const { log_id } = await simulateSendEmail(email)
    log_ids.push(log_id)
    
    // const log = await getLogById(supabaseAdminClient, log_id)
    // if (log?.status === 'complete') {
    //   return true
    // }

    if (!SERVER_URL) {
      // @ts-ignore
      expect(sendMail.mock.calls.length).toEqual(2)
      // @ts-ignore
      sendMail.mock.calls.forEach((call: any) => {
        expect(call[0].subject).toEqual(`re: ${email.subject}`)
      })
      // @ts-ignore
      mockLength = sendMail.mock.calls.length
    }
  }, 30000)

  // it('should test two same emails', async () => {    
  //   const email = createTestEmail()
  //   const { log_id } = await simulateSendEmail(email)
  //   log_ids.push(log_id)
  //   try {
  //     await simulateSendEmail(email)
  //   } catch (error: any) {
  //     expect(error.message).toEqual(LogAlreadyExistsError.message)
  //   }
  // }, 20000)

  afterAll(async () => {
    if (log_ids) {
      await Promise.all(log_ids.map(async (log_id) => {
        await deleteLogById(supabaseAdminClient, log_id)
      }))
    }
  })
})