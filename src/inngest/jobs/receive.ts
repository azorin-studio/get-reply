import supabaseAdminClient from "~/supabase/supabase-admin-client"
import { IncomingEmail, Log } from "~/supabase/types"
import createLog from "~/supabase/create-log"

export default async function receive (incomingEmail: IncomingEmail) {
  const log: Log | null  = await createLog(supabaseAdminClient, incomingEmail as IncomingEmail)
  return log
}
