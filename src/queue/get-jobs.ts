import { queue } from "~/queue/queue"

export default async function getJobs () {
  const active = await queue.process.getJobs(['active'])
  const completed = await queue.process.getJobs(['completed'])
  const delayed = await queue.process.getJobs(['delayed'])
  const failed = await queue.process.getJobs(['failed'])
  const paused = await queue.process.getJobs(['paused'])
  const waiting = await queue.process.getJobs(['waiting'])

  const jobs = {
    active: active.map(job => job.toJSON()),
    completed: completed.map(job => job.toJSON()),
    delayed: delayed.map(job => job.toJSON()),
    failed: failed.map(job => job.toJSON()),
    paused: paused.map(job => job.toJSON()),
    waiting: waiting.map(job => job.toJSON()),
  }

  return jobs
}
