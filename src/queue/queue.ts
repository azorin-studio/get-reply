import processIncomingEmail from '~/queue/process-incoming-email'
import generate from './processes/generate'
import schedule from './processes/schedule'
import send from './processes/send'
import draft from './processes/draft'
import { Inngest } from 'inngest'

export const inngest = new Inngest({ 
  name: "get-reply-dev"
})

const inngestProcessIncomingEmail = inngest.createFunction(
  { name: "process incoming email" },
  { event: "queue/process-incoming-email" },
  async ({ event, step }) => {
    const log = await processIncomingEmail(event.data)
    log.action_ids?.forEach(async (action_id: string) => {
      await inngest.send({ name: 'queue/generate', data: { action_id } })
    })
    return { event, body: log };
  }
);

const inngestGenerate = inngest.createFunction(
  { name: "generate" },
  { event: "queue/generate" },
  async ({ event, step }) => {
    const action = await generate(event.data.action_id)
    await inngest.send({ name: 'queue/schedule', data: { action_id: event.data.action_id } })
    return { event, body: action };
  }
);

const inngestSchedule = inngest.createFunction(
  { name: "schedule" },
  { event: "queue/schedule" },
  async ({ event, step }) => {
    const action = await schedule(event.data.action_id)
    return { event, body: action };
  }
);

const inngestSend = inngest.createFunction(
  { name: "send" },
  { event: "queue/send" },
  async ({ event, step }) => {
    const action = await send(event.data.action_id)
    return { event, body: action };
  }
);

const inngestDraft = inngest.createFunction(
  { name: "draft" },
  { event: "queue/draft" },
  async ({ event, step }) => {
    const action = await draft(event.data.action_id)
    return { event, body: action };
  }
);

export const ingestFns = [
  inngestProcessIncomingEmail,
  inngestGenerate,
  inngestSchedule,
  inngestSend,
  inngestDraft
]