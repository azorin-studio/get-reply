import getLogById from "~/supabase/get-log-by-id"
import supabaseAdminClient from "~/supabase/supabase-admin-client"
import appendToLog from "~/supabase/append-to-log"
import appendToAction from "~/supabase/append-to-action"
import getActionById from "~/supabase/get-action-by-id"

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