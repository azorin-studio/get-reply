import { Inngest, InngestMiddleware } from "inngest"
import calculateSleep from "./jobs/calculate-sleep"
import sendNotFoundEmail from "./jobs/send-not-found-email"
import handleFailure from "./jobs/handle-failure"
import sendConfirmationEmail from "./jobs/send-confirmation-email"
import cancelLogAndActionByLogId from "~/supabase/cancel-log-and-action-by-log-id"
import supabaseAdminClient from "~/supabase/supabase-admin-client"
import createActions from "./jobs/create-actions"
import { Action } from "~/supabase/types"
import reminder from "./jobs/reminder"
import generate from "./jobs/generate"

const myMiddleware = new InngestMiddleware({
  name: "logger middleware",
  init() {
    return {
      onFunctionRun({ fn }) {
        console.log(`+ inngest ${fn.trigger.event} has started`)
        return {
          afterExecution() {
            console.log(`+ inngest ${fn.trigger.event} has finished`)
          },
        }
      },
    }
  },
})

export const inngest = new Inngest({ name: "get-reply", middleware: [myMiddleware], })

const pingFn = inngest.createFunction(
  { name: "ping", retries: 0 },
  { event: "queue/ping" },
  async ({ event }: { event: any, step: any }) => {
    console.log("pong")
    return { event }
  }
)

const sleepFn = inngest.createFunction(
  { 
    name: "sleep", 
    retries: 0, 
    cancelOn: [
      { event: "queue/cancel", match: "data.log_id" }
    ],
  },
  { 
    event: "queue/sleep" 
  },
  async ({ event, step }: { event: any, step: any }) => {   
    const runDate = await step.run('Calculate sleep', async () => calculateSleep(event.data.action_id))
    await step.sleepUntil(runDate)

    await step.run('Schedule', async () => {
      await inngest.send({ 
        id: `queue/reminder-${event.data.action_id}`,
        name: 'queue/reminder', 
        data: { action_id: event.data.action_id, log_id: event.data.log_id }
      })
    })
 }
)

const reminderFn = inngest.createFunction(
  { name: "reminder", retries: 0 },
  { event: "queue/reminder" },
  async ({ event }: { event: any, step: any }) => {
    await reminder(event.data.action_id)
    return { event }
  }
)

const promptNotFoundEmailFn = inngest.createFunction(
  { name: "prompt-not-found-email-", retries: 0 },
  { event: "queue/prompt-not-found-email" },
  async ({ event }: { event: any, step: any }) => {
    await sendNotFoundEmail(event.data.log_id, event.data.promptName)
    return { event }
  }
)

const generateFn = inngest.createFunction(
  { name: "generate", retries: 0 },
  { event: "queue/generate" },
  async ({ event }: { event: any, step: any }) => {
    const action = await generate(event.data.action_id)
    if (!action) throw new Error(`Action ${event.data.action_id} not found`)
    await inngest.send({ 
      id: `queue/sleep-${event.data.action_id}`,
      name: 'queue/sleep', 
      data: { action_id: event.data.action_id, log_id: action.log.id }
    })
    
    return { event }
  }
)

const failureFn = inngest.createFunction(
  { name: "Attached failed event message to log" },
  { event: "inngest/function.failed" },
  async ({ event, step }) => {
    await step.run("Add failure to log", async () => {
      const error = event.data.error
      const originalEvent = event.data.event
      const { log_id, action_id } = originalEvent.data
      handleFailure(log_id, action_id, new Error(error.message))
      throw error
      // return { message: "Error event processed successfully", data: event.data }
    })
  }
)


const createActionsFn = inngest.createFunction(
  { name: "create-actions", retries: 0 },
  { event: "queue/create-actions" },
  async ({ event }: { event: any, step: any }) => {
    const actions = await createActions(event.data.log_id)
    actions.forEach(async (action: Action) => {
      await inngest.send({ 
        id: `queue/generate-${action.id}`,
        name: 'queue/generate', 
        data: { action_id: action.id } 
      })
    })

    await inngest.send({ 
      name: 'queue/confirmation-email',
      id: `queue/confirmation-email-${event.data.log_id}`,
      data: { log_id: event.data.log_id }
    })
    
    return { event }
  }
)

const confirmationEmailFn = inngest.createFunction(
  { name: "confirmation-email", retries: 0 },
  { event: "queue/confirmation-email" },
  async ({ event }: { event: any, step: any }) => {
    await sendConfirmationEmail(event.data.log_id)
    return { event }
  }
)

const cancelFn = inngest.createFunction(
  { name: "queue/cancel", retries: 0 },
  { event: "queue/cancel" },
  async ({ event }: { event: any, step: any }) => {
    await cancelLogAndActionByLogId(supabaseAdminClient, event.data.log_id)
    return { event }
  }
)

export const ingestEvents = [
  createActionsFn,
  generateFn,
  sleepFn,
  failureFn,
  confirmationEmailFn,
  promptNotFoundEmailFn,
  reminderFn,
  cancelFn,
  pingFn
]


