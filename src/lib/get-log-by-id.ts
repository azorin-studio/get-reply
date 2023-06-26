import supabaseAdminClient from "~/lib/server-admin-client"
import { Log } from "~/lib/types"

export default async function getLogById (id: string): Promise<Log | null | undefined> {
  const { error, data: logs } = await supabaseAdminClient
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
