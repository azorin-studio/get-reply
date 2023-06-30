
import { serve } from "inngest/next"
import { inngest, ingestEvents } from "~/inngest/inngest"

export const { GET, POST, PUT } = serve(inngest, [...ingestEvents])