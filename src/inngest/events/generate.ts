import getActionById from "~/supabase/get-action-by-id"
import { inngest } from "../inngest"
import generate from "../jobs/generate"
import supabaseAdminClient from "~/supabase/supabase-admin-client"

export default inngest.createFunction(
  { name: "generate", retries: 0 },
  { event: "queue/generate" },
  async ({ event }: { event: any, step: any }) => {
    console.log(`[action_id: ${event.data.action_id}]: in queue/generate`)
    const action = await generate(event.data.action_id)
    console.log(`[action_id: ${event.data.action_id}]: Sending to queue/schedule`)

    if (!action) throw new Error(`Action ${event.data.action_id} not found`)

    const act = await getActionById(supabaseAdminClient, action.id!)
    if (!act) throw new Error(`Action ${event.data.action_id} not found`)

    await inngest.send({ 
      id: `queue/schedule-${event.data.action_id}`,
      name: 'queue/schedule', 
      data: { action_id: event.data.action_id, log_id: act.log.id }
    })
    
    return { event }
  }
)
