import fetchAllPiecesFromActionId from "~/supabase/fetch-all-pieces-from-action-id"
import { inngest } from "../inngest"
import collab from "../jobs/collab"
import supabaseAdminClient from "~/supabase/supabase-admin-client"
import appendToLog from "~/supabase/append-to-log"
import appendToAction from "~/supabase/append-to-action"

export default inngest.createFunction(
  { name: "queue/cancel", retries: 0 },
  { event: "queue/cancel" },
  async ({ event }: { event: any, step: any }) => {
    let { log, action,  } = await fetchAllPiecesFromActionId(supabaseAdminClient, event.data.action_id)
    
    await appendToLog(supabaseAdminClient, log, { status: 'cancelled' })
    await appendToAction(supabaseAdminClient, action, { status: 'cancelled' })
  
  
  return { event }
  }
)
