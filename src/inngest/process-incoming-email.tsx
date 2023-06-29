import createLog from "~/supabase/create-log"
import supabaseAdminClient from "~/supabase/supabase-admin-client"
import { IncomingEmail, Log } from "~/supabase/types"
import { inngest } from "./inngest"

export const processIncomingEmail = async (incomingEmail: IncomingEmail) => {
  if (!incomingEmail.messageId) {
    throw new Error('No messageId')
  }
  
  const log: Log | null  = await createLog(supabaseAdminClient, incomingEmail as IncomingEmail)
   
  await inngest.send({ 
    name: 'queue/create-actions',
    data: { log_id: log.id }
  })

  return log
}
