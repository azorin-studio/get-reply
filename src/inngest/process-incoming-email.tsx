import createLog from "~/supabase/create-log"
import supabaseAdminClient from "~/supabase/supabase-admin-client"
import { IncomingEmail, Log } from "~/supabase/types"
import { inngest } from "./inngest"
import getLogByKey from "~/supabase/get-log-by-key"

export const processIncomingEmail = async (incomingEmail: IncomingEmail) => {
  if (!incomingEmail.messageId) {
    throw new Error('No messageId')
  }
  
  const existingLog = await getLogByKey(supabaseAdminClient, 'messageId', incomingEmail.messageId)
  let log: Log | null 
  
  if (existingLog) {
    log = existingLog
    console.log(`Log ${log.id} already exists`)
  } else {
    log = await createLog(supabaseAdminClient, incomingEmail as IncomingEmail)
    console.log(`Log ${log.id} created`)
  }
  
  if (!log || !log.id || !log.sequence) {
    console.log(`Log ${log.id} not created`)
    throw new Error('Log not created')
  }

  await inngest.send({ 
    name: 'queue/create-actions',
    data: { log_id: log.id }
  })

  return log
}
