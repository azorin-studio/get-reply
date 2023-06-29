import { inngest } from "../inngest"
import reminder from "../jobs/reminder"

export default inngest.createFunction(
  { name: "reminder", retries: 0 },
  { event: "queue/reminder" },
  async ({ event }: { event: any, step: any }) => {
    console.log(`[action_id: ${event.data.action_id}]: in queue/reminder`)
    await reminder(event.data.action_id)
    return { event }
  }
)
