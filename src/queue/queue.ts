import { Queue, Worker, QueueEvents } from 'bullmq'
import ioredis from 'ioredis'
import processIncomingEmail from '~/queue/processes/process-incoming-email'
import generate from './processes/generate'
import schedule from './processes/schedule'

if (!process.env.KV_URL) throw new Error('KV_URL is not defined')

const queueName = `queue-${process.env.NODE_ENV}`

const redis = new ioredis(process.env.KV_URL, {
  tls: {
    rejectUnauthorized: false,
  },
  maxRetriesPerRequest: null
})

export const queue = new Queue(queueName, { connection: redis })
const queueEvents = new QueueEvents(queueName, { connection: redis })

const work = async (job: any) => {
  if (job.name === 'process-incoming-mail') {
    const log = await processIncomingEmail(job.data)
    log.actions_ids?.forEach(async (actionId: string) => {
      await queue.add('generate', { actionId })
    })
    return log
  }

  if (job.name === 'generate') {
    await generate(job.data.actionId)
  }

  if (job.name === 'schedule') {
    // now we schedule the next job in this action, which is either a draft or a send
    // need to calculate the date based on the run_date and the delay in ms
    await schedule(job.data.actionId)
  }

  if (job.name === 'send') {
    await send(job.data.actionId)
  }

  if (job.name === 'draft') {
    await draft(job.data.actionId)
  }
}

const worker = new Worker(queueName, work, { connection: redis })

worker.on('completed', job => {
  console.log(`job-${job.id} [${job.name}] has completed!`)
})

worker.on('failed', (job, err) => {
  console.log(`job-${job.id} has failed with ${err.message}`)
})

queueEvents.on('completed', ({ jobId }) => {
  console.log(`queue completed ${jobId}`)
})

queueEvents.on('failed', ({ jobId, failedReason }: { jobId: string, failedReason: string }) => {
  console.error('error', failedReason)
})