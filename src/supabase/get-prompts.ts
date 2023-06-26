import { SupabaseClient } from "@supabase/supabase-js"

export default async function getPrompts (client: SupabaseClient) {
  const { data: prompts, error } = await client
    .from('prompts')
    .select('*')
    .order('id', { ascending: true })
    .limit(10)

  if (error) throw error
  if (!prompts) return null

  return prompts
}
