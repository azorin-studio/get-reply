import { SupabaseClient } from "@supabase/supabase-js"
import { Action } from "~/supabase/types"

export default async function getActionsById (client: SupabaseClient, id: string): Promise<Action[]> {
  const { error, data: actions } = await client
    .from('actions')
    .select('*, prompt:prompts(*), log:logs(*), profile:profile_id (*)')
    .eq('log_id', id)

  if (error) {
    throw error
  }

  if (!actions || actions.length === 0) {
    return []
  }

  return actions
}
