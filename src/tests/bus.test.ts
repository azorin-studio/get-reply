import processIncomingEmail from "~/bus/process-incoming-email"
import createTestEmail from "./create-test-email"
import { deleteLogById, getLogById } from "~/supabase/supabase"
import { supabaseAdminClient } from "~/supabase/server-client"
import { sendMail } from "../lib/send-mail"
import { LogAlreadyExistsError } from "~/bus/event-list"

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

  it('should test email', async () => {    
    const email = createTestEmail()
    const { log_id } = await simulateSendEmail(email)
    log_ids.push(log_id)
    
    console.log('starting to poll for log status')
    await new Promise((resolve) => {
      const interval = setInterval(async () => {
        const log = await getLogById(supabaseAdminClient, log_id)
        console.log(`polling [log_id: ${log?.id.slice(0,7)}] status: ${log?.status}`)
        if (log?.status === 'complete') {
          clearInterval(interval)
          resolve(true)
        }
      }, 100)
    })
  }, 30000)

  it('should test two same emails', async () => {    
    const email = createTestEmail()
    const { log_id } = await simulateSendEmail(email)
    log_ids.push(log_id)
    try {
      await simulateSendEmail(email)
    } catch (error: any) {
      expect(error.message).toEqual(LogAlreadyExistsError.message)
    }

    console.log('starting to poll for log status')
    await new Promise((resolve) => {
      const interval = setInterval(async () => {
        const log = await getLogById(supabaseAdminClient, log_id)
        console.log(`polling [log_id: ${log?.id.slice(0,7)}] status: ${log?.status}`)
        if (log?.status === 'complete') {
          clearInterval(interval)
          resolve(true)
        }
      }, 100)
    })

  }, 20000)

  afterAll(async () => {
    if (log_ids) {
      await Promise.all(log_ids.map(async (log_id) => {
        await deleteLogById(supabaseAdminClient, log_id)
      }))
    }
  })
})