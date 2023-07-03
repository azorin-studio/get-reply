import { Inngest } from "inngest"
import { serve } from "inngest/next"
import loggerMiddleware from "./middleware"
import eventList from './event-list'
import EventEmitter from "events"
import { IncomingEmail } from "~/supabase/types"

const INGEST_ON = false

let eventEmitter: any = null

if (!INGEST_ON) {
  eventEmitter = new EventEmitter()
  eventList.forEach((fns: any[]) => {
    const event = fns[1].event
    eventEmitter.on(event, async (data: any) => {
      console.log(`eventEmitter: ${event}, ${data}`)
      await fns[2]({ event: { data } })
    })
  })
}

export const inngest = new Inngest({
  name: "get-reply-dev",
  middleware: [loggerMiddleware],
})

export const { GET, POST, PUT } = serve(
  inngest, 
  eventList.map((fns: any[]) => 
    inngest.createFunction(fns[0], fns[1], fns[2])
  )
)

export const send = async (step: any, event: any) => {
  if (INGEST_ON) {
    console.log(`sending: ${event.name}, ${event.data}`)
    if (step) step.sendEvent(event)
    else await inngest.send(event)
  } else {
    eventEmitter.emit(event.name, event.data)
  }
  return { event }
}

export const sends = async (step: any, events: any) => {
  if (INGEST_ON) {
    await inngest.send(events)
  } else {
    events.forEach((event: any) => {
      eventEmitter.emit(event.name, event.data)
    })
  }
  return { events }
}

export const stepRun = async (step: any, name: string, fn: any) => {
  if (INGEST_ON) {
    console.log(`stepRun: ${name}`)
    return step.run(name, fn)
  } else {
    return fn()
  }
}

export const sleepUntil = (step: any, runDate: Date) => {
  if (INGEST_ON) {
    console.log(`sleepUntil: ${runDate}`)
    return step.sleepUntil(runDate)  
  } else {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, runDate.getTime() - new Date().getTime())
    })
  }
}

export const processIncomingEmail = async (incomingEmail: IncomingEmail) => {
  console.log(`+ recieved mail ${incomingEmail.messageId?.slice(1, 7)} from "${incomingEmail.from.address}" with subject "${incomingEmail.subject}"`)
  if (!incomingEmail.messageId) throw new Error('No messageId')
  console.log(`+ sending queue/receive ${incomingEmail.messageId?.slice(1, 7)}`)
  await send(null, {
    name: 'queue/receive',
    id: `queue/receive-${incomingEmail.messageId}`,
    data: { incomingEmail }
  })
}
