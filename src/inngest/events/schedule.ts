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

    await step.run('Send confirmation email', async () => {
      console.log(`[action_id: ${event.data.action_id}]: Sending to queue/confirmation-email`)
      await inngest.send({ 
        name: 'queue/confirmation-email',
        id: `queue/confirmation-email-${event.data.action_id}`,
        data: { action_id: event.data.action_id, log_id: event.data.log_id }
      })
    })

    console.log(`[action_id: ${event.data.action_id}]: sleeping until ${runDate} ms`)
    await step.sleepUntil(runDate)

    await step.run('Schedule', async () => {
      console.log(`[action_id: ${event.data.action_id}]: in queue/schedule - schedule`)
      const { log, action } = await fetchAllPiecesFromActionId(supabaseAdminClient, event.data.action_id)

      if (log.status === 'cancelled' || action.status === 'cancelled') {
        console.log(`[action_id: ${event.data.action_id}]: cancelled`)
        return
      }

      await inngest.send({ 
        id: `queue/reminder-${event.data.action_id}`,
        name: 'queue/reminder', 
        data: { action_id: event.data.action_id, log_id: event.data.log_id }
      })
    })
 }
)
