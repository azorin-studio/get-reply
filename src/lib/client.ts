import { Inngest } from "inngest"

const options: { 
  inngestBaseUrl?: string,
  eventKey?: string,
  name: string,
 } = {
  name: "get-reply-dev",
}

if (process.env.NODE_ENV === "development") {
  options.inngestBaseUrl = "http://localhost:8288/"
  options.eventKey = "dev"
}

export const inngest = new Inngest(options)
