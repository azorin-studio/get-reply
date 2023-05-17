import { addDays, parseISO } from "date-fns"
import { daysBetween } from "~/cron/cron"
import parseSequenceName from "~/cron/parse-sequence-name"
import appendToLog from "~/db/append-to-log"
import getProfileFromEmail from "~/db/get-profile-from-email"
import getSequenceFromLog from "~/db/get-sequence-by-id"
import { Log, Profile } from "~/db/types"
import { createGmailDraftInThread, findThread, makeUnreadInInbox } from "~/google"


export default async function createDraftAndNotify (log: Log): Promise<Log> {
  if (!log.from) {
    throw new Error('No from address found in log')
  }

  const sequence = await getSequenceFromLog(log)
  if (!sequence) {
    const sequenceName = parseSequenceName(log)
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: `Could not find sequence for this address: ${sequenceName}`
    })
    return log
  }

  if (!sequence.steps) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'No prompt list found for this sequence'
    })
    return log
  }

  const profile: Profile = await getProfileFromEmail(log.from.address)

  if (!profile.google_refresh_token) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'No google refresh token found for this email'
    })
    return log
  }

  if (!log.headers || log.headers.length === 0) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'No headers found in log'
    })
    return log
  }

  let thread: any = null
  try {
    thread = await findThread(log.subject!, log.to as any[], profile.google_refresh_token)
    if (!thread) {
      log = await appendToLog(log, {
        status: 'error',
        errorMessage: 'Could not find thread'
      })
      return log
    }
  } catch (err: any) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: err.message || 'Could not find thread'
    })
    return log
  }

  // only one prompt can be placed per day
  const todaysPromptIndex = sequence.steps.findIndex((prompt: any) => {
    const today = new Date()
    const dateToSend = addDays(parseISO(log!.date!), prompt.delay)
    return daysBetween(today, dateToSend) === 0
  })

  if (todaysPromptIndex === undefined || todaysPromptIndex === null || todaysPromptIndex === -1) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'No prompt for today'
    })
    return log
  }

  const isLastPrompt = todaysPromptIndex === sequence.steps.length - 1

  const draft = await createGmailDraftInThread(
    log.to as any[],
    log.from as any,
    log.subject || '',
    log.generations![todaysPromptIndex],
    thread.threadId,
    profile.google_refresh_token
  )

  let allDraftIds = log.draftIds || []
  const newDraftId = draft.id
  if (newDraftId) {
    allDraftIds = [...allDraftIds, newDraftId]
  }

  log = await appendToLog(log, {
    threadId: thread.id,
    draftIds: allDraftIds
  })

  if (isLastPrompt) {
    log = await appendToLog(log, {
      status: 'drafted'
    })
  }
    
  if (draft.message!.id) {
    await makeUnreadInInbox(draft.message!.id, profile.google_refresh_token)
  }

  return log
}