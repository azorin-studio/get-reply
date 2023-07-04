import { getActionById, appendToAction, appendToLog, supabaseAdminClient, getLogById } from "~/supabase/supabase"

export default async function handleFailure (log_id: string, action_id: string, error: Error) {
  if (log_id) {
    const log = await getLogById(supabaseAdminClient, log_id)
    if (log) await appendToLog(supabaseAdminClient, log, { status: "error", errorMessage: error.message })
  }

  if (action_id) {
    const action = await getActionById(supabaseAdminClient, action_id)
    if (action) await appendToAction(supabaseAdminClient, action, { status: "error", errorMessage: error.message })
  }
}