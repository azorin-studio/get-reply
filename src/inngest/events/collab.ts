import { inngest } from "../inngest"
import collab from "../jobs/collab"

export default inngest.createFunction(
  { name: "collab", retries: 0 },
  { event: "queue/collab" },
  async ({ event }: { event: any, step: any }) => {
    console.log(`[action_id: ${event.data.action_id}]: in queue/collab`)
    await collab(event.data.action_id)
    return { event }
  }
)
