import calculateSleep from "./jobs/calculate-sleep"
import sendNotFoundEmail from "./jobs/send-not-found-email"
import handleFailure from "./jobs/handle-failure"
import sendConfirmationEmail from "./jobs/send-confirmation-email"
import cancelLogAndActionByLogId from "~/supabase/cancel-log-and-action-by-log-id"
import supabaseAdminClient from "~/supabase/supabase-admin-client"
import createActions from "./jobs/create-actions"
import { Action, IncomingEmail } from "~/supabase/types"
import reminder from "./jobs/reminder"
import generate from "./jobs/generate"
import receive from "./jobs/receive"
import { send, sends, stepRun, sleepUntil } from "./engine"

export const eventList = [[
  { name: "ping", retries: 0 },
  { event: "queue/ping" },
  async ({ event, step }: { event: any, step: any }) => {
    console.log(`pong: ${event.data.message}`)
    return { event }
  }
], [
  { name: "queue/receive", retries: 0 },
  { event: "queue/receive" },
  async ({ event, step }: { event: any, step: any }) => {
    const log = await stepRun(step, 'Create log from mail', async () => receive(event.data.incomingEmail as IncomingEmail))
    await send(step, {
      name: 'queue/create-actions',
      data: { log_id: log.id }
    })
    return { event }
  }
], [
  { name: "queue/prompt-not-found-email", retries: 0 },
  { event: "queue/prompt-not-found-email" },
  async ({ event }: { event: any, step: any }) => {
    await sendNotFoundEmail(event.data.log_id, event.data.promptName)
    return { event }
  }
], [
  { name: "queue/create-actions", retries: 0 },
  { event: "queue/create-actions" },
  async ({ event, step }: { event: any, step: any }) => {
    const actions = await stepRun(step, 'Create actions', async () => createActions(event.data.log_id))
    const events = actions.map(async (action: Action) => {
      return { 
        id: `queue/generate-${action.id}`,
        name: 'queue/generate', 
        data: { action_id: action.id } 
      }
    })
    await sends(step, events)
    await send(step, { 
      name: 'queue/confirmation-email',
      id: `queue/confirmation-email-${event.data.log_id}`,
      data: { log_id: event.data.log_id }
    })
    
    return { event }
  }
], [
  { name: "queue/confirmation-email", retries: 0 },
  { event: "queue/confirmation-email" },
  async ({ event, step }: { event: any, step: any }) => {
    await sendConfirmationEmail(event.data.log_id)
    return { event }
  }
], [
  { name: "queue/generate", retries: 0 },
  { event: "queue/generate" },
  async ({ event, step }: { event: any, step: any }) => {
    const action = await stepRun(step, 'Generate', async () => generate(event.data.action_id)) 
    await send(step, { 
      id: `queue/sleep-${event.data.action_id}`,
      name: 'queue/sleep', 
      data: { action_id: event.data.action_id, log_id: action.log.id }
    })
    return { event }
  }
],[{ 
    name: "queue/sleep", 
    retries: 0,   
    cancelOn: [
      { event: "queue/cancel", match: "data.log_id" }
    ],
  }, { 
    event: "queue/sleep" 
  },
  async ({ event, step }: { event: any, step: any }) => {   
    const runDate = await stepRun(step, 'Calculate sleep', async () => calculateSleep(event.data.action_id))
    await sleepUntil(step, runDate)
    await send(step, { 
      id: `queue/reminder-${event.data.action_id}`,
      name: 'queue/reminder', 
      data: { action_id: event.data.action_id, log_id: event.data.log_id }
    })
    return { event }
 }
], [
  { name: "queue/reminder", retries: 0 },
  { event: "queue/reminder" },
  async ({ event, step }: { event: any, step: any }) => {
    await reminder(event.data.action_id)
    return { event }
  }
], [
  { name: "queue/cancel", retries: 0 },
  { event: "queue/cancel" },
  async ({ event, step }: { event: any, step: any }) => {
    await stepRun(step, 'Cancel log and action', async () => {
      await cancelLogAndActionByLogId(supabaseAdminClient, event.data.log_id)
    })
    return { event }
  }
],
[
  { name: "inngest/function.failed" },
  { event: "inngest/function.failed" },
  async ({ event, step }: { event: any, step: any }) => {
    await stepRun(step, "Add failure to log", async () => {
      const { log_id, action_id } = event.data.event.data
      await stepRun(step, "Add failure to log", async () => handleFailure(log_id, action_id, new Error(event.data.error.message)))
      return { event }
    })
  }
]
]

export default eventList