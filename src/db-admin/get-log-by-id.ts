import supabaseAdminClient from "./server-admin-client"

export default async function getLogById (id: string) {
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
