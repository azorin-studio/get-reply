import handleFailure from "./jobs/handle-failure"
import allReminders from "./jobs/all-reminders"
import generate from "./jobs/generate"
import receive from "./jobs/receive"
import cancel from "./jobs/cancel"

import sendConfirmationEmail from "./jobs/send-confirmation.email"
import sendNotFoundEmail from "./jobs/send-not-found.email"
import reminder from "./jobs/reminder.email"

interface IEvent {
  name: string
  data: any
}

export const send = async (event: IEvent) => {
  const log_id: string | undefined = event.data.log_id
  const action_id: string | undefined = event.data.action_id
  const logStamp = log_id ? ` [log_id: ${log_id.slice(0,7)}]` : '[log_id: unknown]'
  const actionStamp = action_id ? ` [action_id: ${action_id.slice(0,7)}]` : '[action_id: unknown]'
  // console.log(`+${logStamp}${actionStamp} ${event.name} started`)

  try {
    const re = await (eventBus as any)[event.name](event)
    // console.log(`+${logStamp}${actionStamp} ${event.name} completed`)
    return re
  } catch (error: any) {
    console.error(error)
    handleFailure(log_id, action_id, error.message)
    return { error }
  }
}

export const sendEvents = async (events: IEvent[]) => {
  await Promise.all(
    events.map((event: any) => send(event))
  )
  return { events }
}

export const LogAlreadyExistsError = new Error('Log already exists')

export const eventBus = {
  ping: async (event: IEvent) => {
    console.log('ping')
    return { event }
  },

  receive: async (event: IEvent) => {
    const { actions, log } = await receive(event.data.incomingEmail)

    if (!log) {
      console.log(`+ Log already exists, skipping.`)
      return { log_id: null }
    }

    const events: IEvent[] = actions.map((action) => ({ 
      name: 'generate', 
      data: { log_id: action.log.id, action_id: action.id }
    }))
    
    events.push({         
      name: 'confirmationEmail',
      data: { log_id: log.id }
    })
    await sendEvents(events)
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
    await send({ 
      name: 'allReminders', 
      data: { action_id: event.data.action_id, log_id: action.log.id }
    })
    return { action_id: event.data.action_id, log_id: action.log.id }
  },

  reminder: async (event: IEvent) => {
    await reminder(event.data.action_id)
    return { action_id: event.data.action_id, log_id: event.data.log_id }
  },

  allReminders: async () => {
    const actions = await allReminders()
    return { action_ids: actions.map((action) => action.id) }
  },

  cancel: async (event: IEvent) => {
    cancel(event.data.log_id)
    return { action_id: event.data.action_id, log_id: event.data.log_id }
  },

  failure: async (event: IEvent) => {
    const { log_id, action_id } = event.data
    await handleFailure(log_id, action_id, event.data.error.message)
    return { event }
  }
}
