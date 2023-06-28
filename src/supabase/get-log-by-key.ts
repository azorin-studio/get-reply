import { SupabaseClient } from "@supabase/supabase-js"
import { Log } from "~/supabase/types"

export default async function getLogByKey (client: SupabaseClient, key: string, value: string): Promise<Log | null | undefined> {
  const { error, data: logs } = await client
    .from('logs')
    .select('*, sequence:sequences(*)')
    .eq(key, value)

  if (error) {
    throw error
  }

  if (!logs || logs.length === 0) {
    return null
  }

  const log = logs[0]
  return log
}
