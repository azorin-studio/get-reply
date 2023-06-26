import { inngest } from "../inngest"
import followup from "../jobs/followup"

export default inngest.createFunction(
  { name: "followup", retries: 0 },
  { event: "queue/followup" },
  async ({ event }: { event: any, step: any }) => {
    console.log(`[action_id: ${event.data.action_id}]: in queue/followup`)
    await followup(event.data.action_id)
    return { event }
  }
)
