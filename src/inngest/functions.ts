import processIncomingEmail from '~/inngest/process-incoming-email'
import generate from '~/inngest/processes/generate'
import sendOrDraft from '~/inngest/processes/send-or-draft'
import { inngest } from '~/inngest/client'
import getActionById from '~/db-admin/get-action-by-id'
import { differenceInMilliseconds } from 'date-fns'
import appendToLog from '~/db-admin/append-to-log'
import appendToAction from '~/db-admin/append-to-action'
import getLogById from '~/db-admin/get-log-by-id'

const inngestProcessIncomingEmail = inngest.createFunction(
  { name: "process incoming email" },
  { event: "queue/process-incoming-email" },
  async ({ event, step }: { event: any, step: any }) => {
    console.log(`[log_id: ${event.data.log_id}]: runnng process email`)
    const log = await processIncomingEmail(event.data.log_id)
    
    log.action_ids?.forEach(async (action_id: string) => {
      console.log(`[action_id: ${action_id}]: sending to queue/generate`)
      await inngest.send({ 
        id: `queue/generate-${action_id}`,
        name: 'queue/generate', 
        data: { action_id, log_id: event.data.log_id } 
      })
    })
    
    return { event, body: log }
  }
)

const inngestGenerate = inngest.createFunction(
  { name: "generate" },
  { event: "queue/generate" },
  async ({ event, step }: { event: any, step: any }) => {
    console.log(`[action_id: ${event.data.action_id}]: in queue/generate`)
    const action = await generate(event.data.action_id)

    console.log(`[action_id: ${event.data.action_id}]: Sending to queue/schedule`)
    await inngest.send({ 
      id: `queue/schedule-${event.data.action_id}`,
      name: 'queue/schedule', 
      data: { action_id: event.data.action_id, log_id: event.data.log_id }
    })
    
    return { event, body: action }
  }
)

const inngestSchedule = inngest.createFunction(
  { name: "schedule" },
  { event: "queue/schedule" },
  async ({ event, step }: { event: any, step: any }) => {   
    console.log(`[action_id: ${event.data.action_id}]: in queue/schedule`)

    let action = await step.run('Get action', async () => {
      console.log(`[action_id: ${event.data.action_id}]: in queue/schedule - get action`)
      let action = await getActionById(event.data.action_id)
      if (!action) {
        throw new Error(`Action ${event.data.action_id} not found`)
      }
      return action
    })
    
    let ms = differenceInMilliseconds(new Date(action.run_date as string), new Date())
    if (ms <= 0) {
      ms = 5000
    }
    console.log(`[action_id: ${event.data.action_id}]: sleeping ${ms} ms`)
    await step.sleep(ms)

    action = await step.run('Schedule', async () => {
      console.log(`[action_id: ${event.data.action_id}]: in queue/schedule - schedule`)
      return await sendOrDraft(event.data.action_id)
    })
    console.log(`[action_id: ${event.data.action_id}]: finished queue/schedule`)
    return { event, body: action }
  }
)

const inngestFailure = inngest.createFunction(
  { name: "Attached failed event message to log" },
  { event: "inngest/function.failed" },
  async ({ event, step }) => {
    await step.run("Add failure to log", async () => {
      const error = event.data.error
      const originalEvent = event.data.event
      const log_id = originalEvent.data.log_id
      const action_id = originalEvent.data.action_id

      if (log_id) {
        const log = await getLogById(log_id)
        if (log) {
          await appendToLog(log, {
            status: "error",
            errorMessage: error.message,
          })
        }
      }

      if (action_id) {
        const action = await getActionById(action_id)
        if (action){
          await appendToAction(action, {
            status: "error",
            errorMessage: error.message,
          })
        }
      }

      console.error(error)

      return { message: "Event sent successfully", data: event.data }
    })
  }
)


export const ingestFns = [
  inngestProcessIncomingEmail,
  inngestGenerate,
  inngestSchedule,
  inngestFailure
]