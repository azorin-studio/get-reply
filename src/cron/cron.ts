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
  console.log('process: handling process email event')
  const log = await processEmail(incomingEmail)
  console.log('process: processed email', log.id)
  return log
}  

export const handleVerifyEvent = async () => {
  console.log('verify: handling verify event')
  const logs = await getLogsByStatus('pending')
  console.log('verify: found logs', logs.length)
  const processedLogs = await Promise.all(logs.map((log) => verify(log as Log)))
  console.log('verify: processed logs', processedLogs.length)
  return processedLogs
}

export const handleGenerateEvent = async () => {
  console.log('generate: handling generate event')
  const logs = await getLogsByStatus('verified')
  console.log('generate: found logs', logs.length)
  const processedLogs = await Promise.all(logs.map((log) => generate(log as Log)))
  console.log('generate: processed logs', processedLogs.length)
  return processedLogs
}

export const handleCreateDraftEvent = async () => {
  console.log('create-draft: handling create-draft event')
  const logs = await getLogsByStatus('generated')
  console.log('create-draft: found logs', logs.length)
  const processedLogs = await Promise.all(logs.map((log) => createDraftAndNotify(log as Log)))
  console.log('create-draft: processed logs', processedLogs.length)
  return processedLogs
}