import getActionById from "~/supabase/get-action-by-id"
import { inngest } from "../inngest"
import supabaseAdminClient from "~/supabase/supabase-admin-client"
import fetchAllPiecesFromActionId from "~/supabase/fetch-all-pieces-from-action-id"
import appendToAction from "~/supabase/append-to-action"

export default inngest.createFunction(
  { 
    name: "schedule", 
    retries: 0, 
    cancelOn: [
      { event: "log-cancelled", match: "data.action_id" }
    ],
  },
  { event: "queue/schedule" },
  async ({ event, step }: { event: any, step: any }) => {   
    const runDate = await step.run('Calculate sleep', async () => {
      console.log(`[action_id: ${event.data.action_id}]: in queue/schedule - sleep`)
      const action = await getActionById(supabaseAdminClient, event.data.action_id)
      if (!action) throw new Error(`Action ${event.data.action_id} not found`)
      await appendToAction(supabaseAdminClient, action, { status: 'pending' })
      return action.run_date
    })

    console.log(`[action_id: ${event.data.action_id}]: sleeping until ${runDate} ms`)
    await step.sleepUntil(runDate)

    await step.run('Schedule', async () => {
      console.log(`[action_id: ${event.data.action_id}]: in queue/schedule - schedule`)
      const { sequence, log, action } = await fetchAllPiecesFromActionId(supabaseAdminClient, event.data.action_id)

      if (log.status === 'cancelled' || action.status === 'cancelled') {
        console.log(`[action_id: ${event.data.action_id}]: cancelled`)
        return
      }

      if (sequence.name === 'collab') {
        await inngest.send({ 
          id: `queue/collab-${event.data.action_id}`,
          name: 'queue/collab', 
          data: { action_id: event.data.action_id, log_id: event.data.log_id }
        })
      } else if (sequence.name === 'reply') {
        await inngest.send({ 
          id: `queue/reply-${event.data.action_id}`,
          name: 'queue/reply', 
          data: { action_id: event.data.action_id, log_id: event.data.log_id }
        })
      } else {
        await inngest.send({ 
          id: `queue/followup-${event.data.action_id}`,
          name: 'queue/followup', 
          data: { action_id: event.data.action_id, log_id: event.data.log_id }
        })
      }
    })
 }
)
