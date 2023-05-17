import createDraftAndNotify from "~/cron/draft-event"
import generate from "~/cron/generate-event"
import processEmail from "~/cron/process-event"
import verify from "~/cron/verify-event"
import getLogsByStatus from "~/db/get-logs-by-status"
import { IncomingEmail, Log } from "~/db/types"

export const daysBetween = (first: Date, second: Date): number => {
  return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24))
}

export const handleAllEvents = async () => {
  let l1 = await handleVerifyEvent()
  let l2 = await handleGenerateEvent()
  let l3 = await handleCreateDraftEvent()
  return [...l1, ...l2, ...l3]
}

export const handleProcessEmailEvent = async (incomingEmail: IncomingEmail): Promise<Log> => {
  const log = await processEmail(incomingEmail)
  console.log('processed for', log.id)
  return log
}  

export const handleVerifyEvent = async () => {
  const logs = await getLogsByStatus('pending')
  const processedLogs = await Promise.all(logs.map((log) => verify(log as Log)))
  if (processedLogs.length > 0) console.log('verify: ran on', processedLogs.length)
  return processedLogs
}

export const handleGenerateEvent = async () => {
  const logs = await getLogsByStatus('verified')
  const processedLogs = await Promise.all(logs.map((log) => generate(log as Log)))
  if (processedLogs.length > 0) console.log('generate: ran on', processedLogs.length)
  return processedLogs
}

export const handleCreateDraftEvent = async () => {
  const logs = await getLogsByStatus('generated')
  const processedLogs = await Promise.all(logs.map((log) => createDraftAndNotify(log as Log)))
  if (processedLogs.length > 0) console.log('create-draft: ran on', processedLogs.length)
  return processedLogs
}