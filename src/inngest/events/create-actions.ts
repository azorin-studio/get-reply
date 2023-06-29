import { inngest } from '~/inngest/inngest'
import createActions from '../jobs/create-actions'
import getLogById from '~/supabase/get-log-by-id'
import supabaseAdminClient from '~/supabase/supabase-admin-client'
import { Action } from '~/supabase/types'

export default inngest.createFunction(
  { name: "create-actions", retries: 0 },
  { event: "queue/create-actions" },
  async ({ event }: { event: any, step: any }) => {
    console.log(`[log_id: ${event.data.log_id}]: running create actions`)

    // side effect
    const actions = await createActions(event.data.log_id)
    console.log(`[log_id: ${event.data.log_id}]: sending to queue/generate`)

    const log = await getLogById(supabaseAdminClient, event.data.log_id)
    if (!log) throw new Error(`Log ${event.data.log_id} not found`)

    actions.forEach(async (action: Action) => {
      console.log(`\t[action_id: ${action.id}]: sending action to queue/generate`)
      // side effect, maybe should split with steps
      await inngest.send({ 
        id: `queue/generate-${action.id}`,
        name: 'queue/generate', 
        data: { action_id: action.id } 
      })
    })

    console.log(`[log_id: ${log.id}]: Sending to queue/confirmation-email`)
    await inngest.send({ 
      name: 'queue/confirmation-email',
      id: `queue/confirmation-email-${log.id}`,
      data: { log_id: log.id }
    })
    
    return { event, body: log }
  }
)
