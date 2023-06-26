
import { serve } from "inngest/next";
import { inngest } from "~/inngest/inngest";
import { ingestEvents } from "~/inngest/events";

export const { GET, POST, PUT } = serve(inngest, [...ingestEvents]);