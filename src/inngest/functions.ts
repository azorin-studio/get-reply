import processIncomingEmail from '~/inngest/process-incoming-email'
import generate from './processes/generate'
import schedule from './processes/schedule'
import { inngest } from './client'
import getActionById from '~/db-admin/get-action-by-id'
import { isAfter } from 'date-fns'

const inngestProcessIncomingEmail = inngest.createFunction(
  { name: "process incoming email" },
  { event: "queue/process-incoming-email" },
  async ({ event, step }: { event: any, step: any }) => {
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
  async ({ event, step }: { event: any, step: any }) => {
    const action = await generate(event.data.action_id)
    await inngest.send({ name: 'queue/schedule', data: { action_id: event.data.action_id } })
    return { event, body: action };
  }
);

const inngestSchedule = inngest.createFunction(
  { name: "schedule" },
  { event: "queue/schedule" },
  async ({ event, step }: { event: any, step: any }) => {
    let action = await getActionById(event.data.action_id)
  
    if (!action) {
      throw new Error(`Action ${event.data.action_id} not found`)
    }

    // const d = new Date(action.run_date as string)
    // console.log(isAfter(d, new Date()), d, new Date())
    // if (isAfter(d, new Date())) {
    //   console.log(`Sleeping until ${d}`)
    //   await step.sleepUntil(d)
    // }

    action = await schedule(event.data.action_id)
    
    return { event, body: action };
  }
);

export const ingestFns = [
  inngestProcessIncomingEmail,
  inngestGenerate,
  inngestSchedule,
]