import supabaseAdminClient from "~/lib/server-admin-client"
import { Action } from "~/lib/types"

export default async function appendToAction (action: Action, newTerms: object): Promise<Action> {
  const { error, data: newActions } = await supabaseAdminClient
    .from('actions')
    .update({ ...newTerms })
    .eq('id', action.id)
    .select()

  if (error) {
    throw error
  }

  return newActions[0] as Action
}