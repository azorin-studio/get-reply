import { supabaseAdminClient } from "~/supabase/server-client"
import { appendToAction, appendToLog, getLogByKey, getActionByKey } from "~/supabase/supabase"

export default async function handleFailure (log_id: string | undefined, action_id: string | undefined, errorMessage: string) {
  if (log_id) {
    const log = await getLogByKey(supabaseAdminClient, 'id', log_id)
    if (log) await appendToLog(supabaseAdminClient, log.id, { status: "error", errorMessage: errorMessage })
  }
  if (action_id) {
    const action = await getActionByKey(supabaseAdminClient, 'id', action_id)
    if (action) await appendToAction(supabaseAdminClient, action.id, { status: "error", errorMessage: errorMessage })
  }
}