import supabaseAdminClient from "~/db-admin/server-admin-client"
import { Log } from "~/db-admin/types"

export default async function getLogById (id: string): Promise<Log | null | undefined> {
  const { error, data: logs } = await supabaseAdminClient
    .from('logs')
    .select()
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
