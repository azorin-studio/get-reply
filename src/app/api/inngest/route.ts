
import { serve } from "inngest/next";
import { ingestFns, inngest } from "~/queue/queue";

export const { GET, POST, PUT } = serve(inngest, ingestFns);