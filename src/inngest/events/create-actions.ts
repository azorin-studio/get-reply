import { inngest } from '~/inngest/inngest'
import createActions from '../jobs/create-actions'
import getLogById from '~/supabase/get-log-by-id'
import supabaseAdminClient from '~/supabase/supabase-admin-client'

export default inngest.createFunction(
  { name: "create-actions", retries: 0 },
  { event: "queue/create-actions" },
  async ({ event }: { event: any, step: any }) => {
    console.log(`[log_id: ${event.data.log_id}]: running create actions`)

    // side effect
    await createActions(event.data.log_id)
    console.log(`[log_id: ${event.data.log_id}]: sending to queue/generate`)

    const log = await getLogById(supabaseAdminClient, event.data.log_id)
    log?.action_ids?.forEach(async (action_id: string) => {
      console.log(`[action_id: ${action_id}]: sending to queue/generate`)
      // side effect, maybe should split with steps
      await inngest.send({ 
        id: `queue/generate-${action_id}`,
        name: 'queue/generate', 
        data: { action_id, log_id: event.data.log_id } 
      })
    })
    
    return { event, body: log }
  }
)
