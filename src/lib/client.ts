import { Inngest } from "inngest"

const options: { 
  inngestBaseUrl?: string,
  eventKey?: string,
  name: string,
 } = {
  name: "get-reply-dev",
}

if (process.env.INNGEST_EVENT_KEY && process.env.INNGEST_EVENT_KEY === "local") {
  options.inngestBaseUrl = "http://localhost:8288/"
  options.eventKey = "dev"
}

export const inngest = new Inngest(options)
