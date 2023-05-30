import { Inngest } from "inngest";
import { serve } from "inngest/next";

// Create a client to send and receive events
export const inngest = new Inngest({ name: "My App" });

const helloWorld = inngest.createFunction(
  { name: "Hello World" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("1s");
    return { event, body: "Hello, World!" };
  }
);

export const { GET, POST, PUT } = serve(inngest, [helloWorld]);