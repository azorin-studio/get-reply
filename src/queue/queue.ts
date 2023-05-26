import { Queue, Worker, QueueEvents } from 'bullmq'
import IORedis from 'ioredis'
import action from '~/queue/processes/action'
import generate from '~/queue/processes/generate'
import processIncomingEmail from '~/queue/processes/process-incoming-email'
import schedule from '~/queue/processes/schedule'

// define the queues
if (!process.env.KV_URL) throw new Error('KV_URL is not defined')

const queueName = `queue-${process.env.NODE_ENV}`

const connection = new IORedis(process.env.KV_URL)

export const queue = new Queue(queueName, { connection })
const queueEvents = new QueueEvents(queueName, { connection })

const work = async (job: any) => {
  if (job.name === 'process-incoming-mail') {
    const log = await processIncomingEmail(job.data)
  }
}

const worker = new Worker(queueName, work, { connection })

worker.on('completed', job => {
  console.log(`${job.id} has completed!`)
})

worker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`)
})

queueEvents.on('completed', ({ jobId }) => {
  console.log('done painting')
})

queueEvents.on(
  'failed',
  ({ jobId, failedReason }: { jobId: string, failedReason: string }) => {
    console.error('error painting', failedReason)
  },
)