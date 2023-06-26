
import supabaseAdminClient from "~/lib/server-admin-client"
import { Log } from "~/lib/types"

export default async function getLogsByStatus (status: string) {
  const { error, data: logs } = await supabaseAdminClient
    .from('logs')
    .select()
    .eq('status', status)

  if (error) {
    throw error
  }

  if (!logs) {
    throw new Error(`No logs with status ${status}`)
  }

  return logs as Log[]
}