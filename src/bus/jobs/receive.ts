import { supabaseAdminClient } from "~/supabase/server-client"
import { createLog } from "~/supabase/supabase"
import { IncomingEmail, Log } from "~/supabase/types"

export default async function receive (incomingEmail: IncomingEmail) {
  const log: Log | null  = await createLog(supabaseAdminClient, incomingEmail as IncomingEmail)
  return log
}
