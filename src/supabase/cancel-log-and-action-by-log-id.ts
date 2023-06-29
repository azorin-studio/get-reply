import { SupabaseClient } from "@supabase/supabase-js"
import getLogById from "./get-log-by-id"
import getActionsByLogId from "./get-actions-by-log-id"

export default async function cancelLogAndActionByLogId(client: SupabaseClient, id: string) {
  await client
    .from('logs')
    .update({ status: 'cancelled' })
    .eq('id', id)

  const log = await getLogById(client, id)
  if (!log) {
    throw new Error(`No log found with id ${id}`)
  }

  const actions = await getActionsByLogId(client, id)
    
  await Promise.all(
    actions.map(async (action) => 
      client
        .from('actions')
        .update({ status: 'cancelled' })
        .eq('id', action.id)
    )
  )
}