import supabaseAdminClient from "./server-admin-client"
import { Log } from "./types"

export default async function appendToLog (log: Log, newTerms: object) {
  const { error, data: newLogs } = await supabaseAdminClient
    .from('logs')
    .update({ ...newTerms })
    .eq('id', log.id)
    .select()

  if (error) {
    throw error
  }

  return newLogs[0] as Log
}