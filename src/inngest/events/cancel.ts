import { inngest } from "../inngest"
import supabaseAdminClient from "~/supabase/supabase-admin-client"
import appendToLog from "~/supabase/append-to-log"
import appendToAction from "~/supabase/append-to-action"
import getActionById from "~/supabase/get-action-by-id"

export default inngest.createFunction(
  { name: "queue/cancel", retries: 0 },
  { event: "queue/cancel" },
  async ({ event }: { event: any, step: any }) => {
    const action = await getActionById(supabaseAdminClient, event.data.action_id)
    if (!action) throw new Error(`Action ${event.data.action_id} not found`)

    await appendToLog(supabaseAdminClient, action.log, { status: 'cancelled' })
    await appendToAction(supabaseAdminClient, action, { status: 'cancelled' })
  
    return { event }
  }
)
