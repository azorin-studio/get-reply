import getLogById from "~/supabase/get-log-by-id"
import { inngest } from "../inngest"
import supabaseAdminClient from "~/supabase/supabase-admin-client"
import appendToLog from "~/supabase/append-to-log"
import appendToAction from "~/supabase/append-to-action"
import getActionById from "~/supabase/get-action-by-id"

export default inngest.createFunction(
  { name: "Attached failed event message to log" },
  { event: "inngest/function.failed" },
  async ({ event, step }) => {
    await step.run("Add failure to log", async () => {
      const error = event.data.error
      const originalEvent = event.data.event
      const log_id = originalEvent.data.log_id
      const action_id = originalEvent.data.action_id

      if (log_id) {
        const log = await getLogById(supabaseAdminClient, log_id)
        if (log) {
          await appendToLog(supabaseAdminClient, log, { status: "error", errorMessage: error.message })
        }
      }

      if (action_id) {
        const action = await getActionById(supabaseAdminClient, action_id)
        if (action){ 
          await appendToAction(supabaseAdminClient, action, { status: "error", errorMessage: error.message })
        }
      }

      console.error(error)
      return { message: "Error event processed successfully", data: event.data }
    })
  }
)
