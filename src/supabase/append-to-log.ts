import { SupabaseClient } from "@supabase/supabase-js"
import { Log } from "~/supabase/types"

export default async function appendToLog (client: SupabaseClient, log: Log, newTerms: object): Promise<Log> {
  const { error, data: newLogs } = await client
    .from('logs')
    .update({ ...newTerms })
    .eq('id', log.id)
    .select()

  if (error) {
    throw error
  }

  return (newLogs[0] as any) as Log
}