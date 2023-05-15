import getSequenceFromLog from "~/cron/get-sequence-by-id"
import parseSequenceName from "~/cron/parse-sequence-name"
import { appendToLog } from "~/supabase"
import { Log } from "~/types"

export default async function verify (log: Log): Promise<Log> {
  // TODO check dmarc and stuff
  if (!log.text) {
    console.log('No text found in incoming email')
    log = await appendToLog(log, {
      status: 'error',
      errorMesaage: 'No text found in incoming email'
    })
    return log
  }

  const sequence = await getSequenceFromLog(log)
  if (!sequence || !sequence.steps || sequence.steps.length === 0) {
    const sequenceName = parseSequenceName(log)
    console.log(`Could not find sequence:${sequenceName}`)
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: `Could not find sequence:${sequenceName}`
    })
    return log
  }

  log = await appendToLog(log, {
    status: 'verified',
    sequence_id: sequence.id
  })

  return log
}