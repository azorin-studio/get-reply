import { SupabaseClient } from "@supabase/supabase-js"

export default async function deleteLogById (client: SupabaseClient, id: string): Promise<void> {
  const { error, data: logs } = await client
    .from('logs')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}
