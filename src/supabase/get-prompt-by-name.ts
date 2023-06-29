import { SupabaseClient } from "@supabase/supabase-js"
import { Prompt } from "./types"

export default async function getPromptByName(client: SupabaseClient, promptName: string, passedSupabase?: any) {
  let supabase = client
  if (passedSupabase) {
    supabase = passedSupabase
  }

  const { error, data: prompts } = await supabase
    .from('prompts')
    .select('*, profile:profile_id (*)')
    .eq('name', promptName)

  if (error) {
    throw error
  }

  if (!prompts || prompts.length === 0) {
    return null
  }

  const prompt = prompts[0]
  return prompt as Prompt
}
