
export default async function schedule (job, done) {
  const action_id: string = job.data.action_id
  console.log({ action_id })
  done(null)
}
