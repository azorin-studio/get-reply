import { SupabaseClient } from "@supabase/supabase-js"
import getLogById from "./get-log-by-id"

export default async function cancelLogAndActionByLogId(client: SupabaseClient, id: string) {
  await client
    .from('logs')
    .update({ status: 'cancelled' })
    .eq('id', id)

  const log = await getLogById(client, id)
  // do same for all action_ids
  if (log && log.action_ids) {
    await Promise.all(
      log.action_ids.map(async (action_id) => 
        client
          .from('actions')
          .update({ status: 'cancelled' })
          .eq('id', action_id)
      )
    )
  }
}