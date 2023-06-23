
import { serve } from "inngest/next";
import { inngest } from "~/lib/client";
import { ingestFns } from "~/lib/functions";

const helloWorld = inngest.createFunction(
  { name: "Hello World" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("1s");
    return { event, body: "Hello, World!" };
  }
);

export const { GET, POST, PUT } = serve(inngest, [...ingestFns, helloWorld]);