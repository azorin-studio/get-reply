
import supabaseAdminClient from "./server-admin-client"
import { Log } from "./types"

export default async function getLogsByStatus (status: string) {
  console.log('getLogsByStatus', status)
  console.log('getLogsByStatus', {
    supabaseAdminClient,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  })

  const { error, data: logs } = await supabaseAdminClient
    .from('logs')
    .select()
    .eq('status', status)

  console.log('getLogsByStatus', logs, error)

  if (error) {
    throw error
  }

  if (!logs) {
    throw new Error(`No logs with status ${status}`)
  }

  return logs as Log[]
}