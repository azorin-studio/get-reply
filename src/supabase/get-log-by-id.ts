import { SupabaseClient } from "@supabase/supabase-js"
import { Log, LogRead } from "~/supabase/types"

export default async function getLogById (client: SupabaseClient, id: string): Promise<LogRead | null | undefined> {
  const { error, data: logs } = await client
    .from('logs')
    .select('*, profile:profile_id (*)')

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
