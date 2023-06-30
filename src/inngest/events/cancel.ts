import cancelLogAndActionByLogId from "~/supabase/cancel-log-and-action-by-log-id"
import { inngest } from "../inngest"
import supabaseAdminClient from "~/supabase/supabase-admin-client"

export default inngest.createFunction(
  { name: "queue/cancel", retries: 0 },
  { event: "queue/cancel" },
  async ({ event }: { event: any, step: any }) => {

    console.log(`[log_id: ${event.data.log_id}] in queue/cancel`)

    await cancelLogAndActionByLogId(supabaseAdminClient, event.data.log_id)

    return { event }
  }
)
