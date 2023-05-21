import createDraftAndNotify from "~/cron/draft-event"
import generate from "~/cron/generate-event"
import verify from "~/cron/verify-event"
import getLogsByStatus from "~/db/get-logs-by-status"
import { IncomingEmail, Log } from "~/db/types"
import assignActionEvent from "./assign-action-event"
import processEmail from "./process-event"
import replyEvent from "./reply-event"

export const daysBetween = (first: Date, second: Date): number => {
  return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24))
}

export const handleAllEvents = async () => {
  console.log('handleAllEvents')
  let l1 = await handleVerifyEvent()
  let l2 = await handleGenerateEvent()
  let l3 = await handleCreateDraftEvent()
  let l4 = await handleReplyEvent()
  let l5 = await handleAssignActionEvent()

  return [...l1, ...l2, ...l3, ...l4, ...l5]
}

export const handleProcessEmailEvent = async (incomingEmail: IncomingEmail): Promise<Log> => {
  console.log('handleProcessEmailEvent')
  const log = await processEmail(incomingEmail)
  console.log('processed for', log.id)
  handleVerifyEvent()
  return log
}  

export const handleVerifyEvent = async () => {
  const logs = await getLogsByStatus('pending')
  const processedLogs = await Promise.all(logs.map((log) => verify(log as Log)))
  if (processedLogs.length > 0) console.log('verify: ran on', processedLogs.length)
  handleGenerateEvent()
  return processedLogs
}

export const handleGenerateEvent = async () => {
  const logs = await getLogsByStatus('verified')
  const processedLogs = await Promise.all(logs.map((log) => generate(log as Log)))
  if (processedLogs.length > 0) console.log('generate: ran on', processedLogs.length)
  handleAssignActionEvent()
  return processedLogs
}

export const handleAssignActionEvent = async () => {
  const logs = await getLogsByStatus('generated')
  const processedLogs = await Promise.all(logs.map((log) => assignActionEvent(log as Log)))
  if (processedLogs.length > 0) console.log('assign action: ran on', processedLogs.length)
  handleCreateDraftEvent()
  handleReplyEvent()
  return processedLogs
}

export const handleCreateDraftEvent = async () => {
  const logs = await getLogsByStatus('to-draft')
  const processedLogs = await Promise.all(logs.map((log) => createDraftAndNotify(log as Log)))
  if (processedLogs.length > 0) console.log('create-draft: ran on', processedLogs.length)
  return processedLogs
}

export const handleReplyEvent = async () => {
  const logs = await getLogsByStatus('to-reply')
  console.log('handle-replay: running on', logs.length)
  const processedLogs = await Promise.all(logs.map((log) => replyEvent(log as Log)))
  if (processedLogs.length > 0) console.log('handle-reply: ran on', processedLogs.length)
  return processedLogs
}
