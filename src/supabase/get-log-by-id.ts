import { SupabaseClient } from "@supabase/supabase-js"
import { Log } from "~/supabase/types"

export default async function getLogById (client: SupabaseClient, id: string): Promise<Log | null | undefined> {
  const { error, data: logs } = await client
    .from('logs')
    .select('*, sequence:sequences(*)')
    .eq('id', id)

  if (error) {
    throw error
  }

  if (!logs || logs.length === 0) {
    return null
  }

  const log = logs[0]
  return log
}
