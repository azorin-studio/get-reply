import { inngest } from "../inngest"
import generate from "../jobs/generate"

export default inngest.createFunction(
  { name: "generate", retries: 0 },
  { event: "queue/generate" },
  async ({ event }: { event: any, step: any }) => {
    console.log(`[action_id: ${event.data.action_id}]: in queue/generate`)
    const action = await generate(event.data.action_id)

    console.log(`[action_id: ${event.data.action_id}]: Sending to queue/schedule`)
    await inngest.send({ 
      id: `queue/schedule-${event.data.action_id}`,
      name: 'queue/schedule', 
      data: { action_id: event.data.action_id, log_id: event.data.log_id }
    })
    
    return { event }
  }
)
