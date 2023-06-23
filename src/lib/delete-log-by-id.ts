import supabaseAdminClient from "~/lib/server-admin-client"

export default async function deleteLogById (id: string): Promise<void> {
  const { error, data: logs } = await supabaseAdminClient
    .from('logs')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}
