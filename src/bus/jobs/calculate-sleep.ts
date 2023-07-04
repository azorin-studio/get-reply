import { supabaseAdminClient, getActionById, appendToAction, appendToLog } from "~/supabase/supabase"

export default async function calculateSleep (action_id: string) {
  const action = await getActionById(supabaseAdminClient, action_id)
  if (!action) throw new Error(`Action ${action_id} not found`)

  if (action.status === 'cancelled') {
    return
  }

  await appendToAction(supabaseAdminClient, action, { status: 'sleeping' })
  await appendToLog(supabaseAdminClient, action.log, { status: 'sleeping' })
  return action.run_date
}