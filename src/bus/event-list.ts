import { cancelLogAndActionByLogId, createLog } from "~/supabase/supabase"
import createActions from "./jobs/create-actions"
import { Action, IncomingEmail, Log } from "~/supabase/types"
import reminder from "./jobs/reminder.email"
import sendConfirmationEmail from "./jobs/send-confirmation.email"
import sendNotFoundEmail from "./jobs/send-not-found.email"
import calculateSleep from "./jobs/calculate-sleep"
import handleFailure from "./jobs/handle-failure"
import generate from "./jobs/generate"
import { supabaseAdminClient } from "~/supabase/server-client"

interface IEvent {
  id?: string
  name: string
  data: any
}

export const send = async (event: IEvent) => {
  const log_id: string | undefined = event.data.log_id
  const action_id: string | undefined = event.data.action_id
  const logStamp = log_id ? ` [log_id: ${log_id.slice(0,7)}]` : '[log_id: unknown]'
  const actionStamp = action_id ? ` [action_id: ${action_id.slice(0,7)}]` : '[action_id: unknown]'
  console.log(`+${logStamp}${actionStamp} ${event.name} started`)

  try {
    const re = await eventBus[event.name](event)
    console.log(`+${logStamp}${actionStamp} ${event.name} completed`)
    return re
  } catch (error: any) {
    console.error(`+${logStamp}${actionStamp} ${event.name} failed with message ${error.message}`)
    handleFailure(log_id, action_id, error.message)
    return { error }
  }
  
}

export const sendEvents = async (events: IEvent[]) => {
  console.log(`+ ${events.map((e: any) => e.name).join(', ')} started`)
  await Promise.all(
    events.map((event: any) => send(event))
  )
  return { events }
}

interface IEventBus {
  [key: string]: (event: IEvent) => Promise<any>
}

export const LogAlreadyExistsError = new Error('Log already exists')

export const eventBus: IEventBus = {
  ping: async (event: IEvent) => {
    console.log('ping')
    return { event }
  },

  receive: async (event: IEvent) => {
    const log: Log | null  = await createLog(supabaseAdminClient, event.data.incomingEmail as IncomingEmail)
    if (!log) return { log_id: null, error: 'Log already exists' }
    const actions = await createActions(log.id)
    const events: IEvent[] = actions.map((action: Action) => {
      return { 
        id: `generate-${action.id}`,
        name: 'generate', 
        data: { log_id: log.id, action_id: action.id }
      }
    })
    events.push({         
      name: 'confirmationEmail',
      id: `confirmationEmail-${log.id}`,
      data: { log_id: log.id }
    })
    sendEvents(events)
    return { log_id: log.id }
  },

  promptNotFoundEmail: async (event: IEvent) => {
    await sendNotFoundEmail(event.data.log_id, event.data.promptName)
    return { log_id: event.data.log_id }
  },

  confirmationEmail: async (event: IEvent) => {
    await sendConfirmationEmail(event.data.log_id)
    return { log_id: event.data.log_id }
  },

  generate: async (event: IEvent) => {
    const action = await generate(event.data.action_id)
    send({ 
      id: `sleep-${event.data.action_id}`,
      name: 'sleep', 
      data: { action_id: event.data.action_id, log_id: action.log.id }
    })
    return { action_id: event.data.action_id, log_id: action.log.id }
  },

  sleep: async (event: IEvent) => {   
    const runDate = await calculateSleep(event.data.action_id)
    await send({
      id: `reminder-${event.data.action_id}`,
      name: 'reminder', 
      data: { action_id: event.data.action_id, log_id: event.data.log_id }
    })
    return { action_id: event.data.action_id, log_id: event.data.log_id }
  },

  reminder: async (event: IEvent) => {
    await reminder(event.data.action_id)
    return { action_id: event.data.action_id, log_id: event.data.log_id }
  },

  cancel: async (event: IEvent) => {
    await cancelLogAndActionByLogId(supabaseAdminClient, event.data.log_id)
    return { action_id: event.data.action_id, log_id: event.data.log_id }
  },

  failure: async (event: IEvent) => {
    const { log_id, action_id } = event.data
    await handleFailure(log_id, action_id, event.data.error.message)
    return { event }
  }
}
