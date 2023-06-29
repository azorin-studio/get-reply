import { SupabaseClient } from "@supabase/supabase-js"
import { Log } from "~/supabase/types"

export default async function getLogsByStatus (client: SupabaseClient, status: string) {
  const { error, data: logs } = await client
    .from('logs')
    .select('*, profile:profile_id (*)')
    .eq('status', status)

  if (error) {
    throw error
  }

  if (!logs) {
    throw new Error(`No logs with status ${status}`)
  }

  return logs as Log[]
}