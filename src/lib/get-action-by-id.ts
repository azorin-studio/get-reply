import supabaseAdminClient from "~/lib/server-admin-client"
import { Action } from "~/lib/types"

export default async function getActionById (id: string): Promise<Action | null> {
  const { error, data: actions } = await supabaseAdminClient
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
