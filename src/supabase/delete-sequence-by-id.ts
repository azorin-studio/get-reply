import { SupabaseClient } from "@supabase/supabase-js"

export default async function deleteSequenceById (client: SupabaseClient, id: string): Promise<void> {
  const { error, data: logs } = await client
    .from('sequences')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}
