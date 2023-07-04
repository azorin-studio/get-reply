import { Inngest } from "inngest"
import { serve } from "inngest/next"
import loggerMiddleware from "./middleware"
import eventList from './event-list'
import EventEmitter from "events"

const INGEST_ON = false

export const eventEmitter = new EventEmitter()
eventList.forEach((fns: any[]) => {
  const event = fns[1].event
  console.log(`emitter listening for: ${event}`)
  eventEmitter.on(event, async (data: any) => {
    console.log(`+ event: ${event} started`)
    await fns[2]({ event: { data } })
    console.log(`+ event: ${event} finished`)
  })
})
console.log(`+ eventEmitter ready`)
eventEmitter.emit('queue/ready')

export const getEventEmitter = () => {
  eventEmitter.emit('queue/ready')
  return eventEmitter
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
  console.log(`sending: ${event.name}, ${event.data}`)
  if (INGEST_ON) {
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
  // if (INGEST_ON) {
  //   // return step.run(name, fn)
  // } else {
  //   console.log(`fake stepRun: ${name}`)
  //   // return fn()
  // }
}

export const sleepUntil = async (step: any, runDate: Date) => {
  if (INGEST_ON) {
    console.log(`sleepUntil: ${runDate}`)
    return step.sleepUntil(runDate)  
  } else {
    console.log(`fake sleepUntil: ${runDate}`)
    return 
  }
}

