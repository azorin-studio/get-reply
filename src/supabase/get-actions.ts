import { SupabaseClient } from "@supabase/supabase-js"
import { Action } from "~/supabase/types"

export default async function getActionById (client: SupabaseClient): Promise<Action[]> {
  const { error, data: actions } = await client
    .from('actions')
    .select()

  if (error) {
    throw error
  }

  if (!actions || actions.length === 0) {
    return []
  }


  return actions
}
