import { Inngest } from "inngest"
import { serve } from "inngest/next"
import loggerMiddleware from "./middleware"
import eventList from './event-list'
import EventEmitter from "events"
import { IncomingEmail } from "~/supabase/types"

const INNGEST_EVENT_KEY = process.env.INNGEST_EVENT_KEY

export const inngest = new Inngest({
  name: "get-reply-dev",
  middleware: [loggerMiddleware],
  eventKey: INNGEST_EVENT_KEY || 'emptystring',
})

export const { GET, POST, PUT } = serve(
  inngest, 
  eventList.map((fns: any[]) => 
    inngest.createFunction(fns[0], fns[1], fns[2])
  )
)

let eventEmitter: any
export const getEventEmitter = (): EventEmitter => {
  if (eventEmitter) return eventEmitter

  eventEmitter = new EventEmitter()
  eventList.forEach((fns: any[]) => {
    const event = fns[1].event
    eventEmitter.on(event, async (data: any) => {
      try {
        console.log(`${event} has started`)
        await fns[2]({ event: { data } })
        console.log(`${event} has finished`)
      } catch (error) {
        await send(null, {
          name: 'inngest/function.failed',
          id: `inngest/function.failed-${event}-${data.id}`,
          data: { 
            event, 
            data: {
              log_id: data.log_id,
              action_id: data.action_id,
            }, 
            error 
          }
        })
        console.error(error)
      }
    })
  })
  return eventEmitter
}

const ids: string[] = []
export const send = async (step: any, event: any) => {
  if (INNGEST_EVENT_KEY) {
    if (step) step.sendEvent(event)
    else inngest.send(event)
  } else {
    const em = getEventEmitter()
    const id = event.id || null
    if (id && ids.includes(id))  {
      console.log(`+ skipping ${event} ${id}`)
      return
    } else {
      ids.push(id)
    }
    em.emit(event.name, event.data)
  }
  return { event }
}
export const sends = async (step: any, events: any) => {
  if (INNGEST_EVENT_KEY) {
    await step.sendEvent(events)
  } else {
    events.forEach((event: any) => {
      eventEmitter.emit(event.name, event.data)
    })
  }
  return { events }
}

export const stepRun = async (step: any, name: string, fn: any) => {
  if (INNGEST_EVENT_KEY) return step.run(name, fn)
  return fn()
}

export const sleepUntil = async (step: any, runDate: Date) => {
  if (INNGEST_EVENT_KEY) return step.sleepUntil(runDate)  
  return 
}

export const processIncomingEmail = async (incomingEmail: IncomingEmail) => {
  console.log(`+ received mail ${incomingEmail.messageId} from "${incomingEmail.from.address}" with subject "${incomingEmail.subject}"`)
  if (!incomingEmail.messageId) throw new Error('No messageId')
  console.log(`+ sending queue/receive ${incomingEmail.messageId}`)
  await send(null, {
    name: 'queue/receive',
    id: `queue/receive-${incomingEmail.messageId}`,
    data: { incomingEmail }
  })
}
