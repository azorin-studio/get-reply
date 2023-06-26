import { Action } from "~/supabase/types"
import { SupabaseClient } from "@supabase/supabase-js"

export default async function appendToAction (client: SupabaseClient, action: Action, newTerms: object): Promise<Action> {
  const { error, data: newActions } = await client
    .from('actions')
    .update({ ...newTerms })
    .eq('id', action.id)
    .select()

  if (error) {
    throw error
  }

  return newActions[0] as Action
}