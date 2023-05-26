import { queue } from "~/queue/queue"

export default async function generate (job, done) {
  const action_id: string = job.data.action_id
  console.log({ action_id })
  // TODO: make generations with chatgpt and save to action
  queue.schedule.add({ action_id })
  done(null)
}
