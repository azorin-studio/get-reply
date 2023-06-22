import supabaseAdminClient from "~/db-admin/server-admin-client"
import { Log } from "~/db-admin/types"

export default async function deleteLogById (id: string): Promise<void> {
  const { error, data: logs } = await supabaseAdminClient
    .from('logs')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}
