import { SupabaseClient } from "@supabase/supabase-js"
import { Action } from "~/supabase/types"

export default async function getActionById (client: SupabaseClient, id: string): Promise<Action | null> {
  const { error, data: actions } = await client
    .from('actions')
    .select()
    .eq('id', id)

  if (error) {
    throw error
  }

  if (!actions || actions.length === 0) {
    return null
  }

  const action = actions[0]
  return action
}
