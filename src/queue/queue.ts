import { Queue, Worker, QueueEvents } from 'bullmq'
import ioredis from 'ioredis'
import processIncomingEmail from '~/queue/process-incoming-email'
import generate from './processes/generate'
import schedule from './processes/schedule'
import send from './processes/send'
import draft from './processes/draft'

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
    console.log('process-incoming-mail', job.data)
    const log = await processIncomingEmail(job.data)
    log.actions_ids?.forEach(async (actionId: string) => {
      await queue.add('generate', { actionId })
    })
    return log
  }

  if (job.name === 'generate') {
    console.log('generate', job.data.actionId)
    const action = await generate(job.data.actionId)
    await queue.add('schedule', { actionId: job.data.actionId })
    return action
  }

  if (job.name === 'schedule') {
    // now we schedule the next job in this action, which is either a draft or a send
    // need to calculate the date based on the run_date and the delay in ms
    console.log('schedule', job.data.actionId)
    return await schedule(job.data.actionId)
  }

  if (job.name === 'send') {
    console.log('send', job.data.actionId)
    return await send(job.data.actionId)
  }

  if (job.name === 'draft') {
    console.log('draft', job.data.actionId)
    return await draft(job.data.actionId)
  }
}

const worker = new Worker(queueName, work, { connection: redis })

worker.on('completed', job => {
  console.log(`job-${job.id} [${job.name}] has completed!`)
})

worker.on('failed', (job, err) => {
  console.log(`job-${job.id} has failed with ${err.message}`)
  console.error(err)
})

worker.on('error', (err) => {
  console.log(`worker has failed with ${err.message}`)
})

worker.on('active', job => {
  console.log(`job-${job.id} [${job.name}] is active!`)
})

queueEvents.on('completed', ({ jobId }) => {
  console.log(`queue completed ${jobId}`)
})

queueEvents.on('added', ({ jobId }) => {
  console.log(`queue added ${jobId}`)
})

queueEvents.on('failed', ({ jobId, failedReason }: { jobId: string, failedReason: string }) => {
  console.error('error', failedReason)
})

process.on('SIGINT', async () => {
  await worker.close()
})