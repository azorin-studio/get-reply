import { supabaseAdminClient } from "~/supabase/server-client"
import { getActionById, appendToAction, appendToLog, getLogById } from "~/supabase/supabase"

export default async function handleFailure (log_id: string | undefined, action_id: string | undefined, errorMessage: string) {
  if (log_id) {
    const log = await getLogById(supabaseAdminClient, log_id)
    if (log) await appendToLog(supabaseAdminClient, log, { status: "error", errorMessage: errorMessage })
  }
  if (action_id) {
    const action = await getActionById(supabaseAdminClient, action_id)
    if (action) await appendToAction(supabaseAdminClient, action, { status: "error", errorMessage: errorMessage })
  }
}