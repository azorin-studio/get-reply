import { SupabaseClient } from "@supabase/supabase-js"

export default async function getPromptById (client: SupabaseClient, id: string) {
  const { error, data: prompts } = await client
    .from('prompts')
    .select()
    .eq('id', id)

  if (error) {
    throw error
  }

  if (!prompts || prompts.length === 0) {
    return null
  }

  const prompt = prompts[0]
  return prompt
}
