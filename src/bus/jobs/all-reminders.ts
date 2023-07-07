import { supabaseAdminClient } from "~/supabase/server-client";
import { getActionsByKey } from "~/supabase/supabase";
import { Action } from "~/supabase/types";
import reminder from "./reminder.email";


export default async function allReminders(): Promise<Action[]> {
  const actions = await getActionsByKey(supabaseAdminClient, 'status', 'sleeping')
  await Promise.all(
    actions.map((action: Action) => reminder(action.id))
  )
  return actions
}