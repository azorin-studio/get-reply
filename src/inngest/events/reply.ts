import { inngest } from "../inngest"
import reply from "../jobs/reply"

export default inngest.createFunction(
  { name: "reply", retries: 0 },
  { event: "queue/reply" },
  async ({ event }: { event: any, step: any }) => {
    console.log(`[action_id: ${event.data.action_id}]: in queue/reply`)
    await reply(event.data.action_id)
    return { event }
  }
)
