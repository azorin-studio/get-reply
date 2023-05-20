import { addDays, parseISO } from "date-fns";
import appendToLog from "~/db/append-to-log";
import getProfileFromEmail from "~/db/get-profile-from-email";
import getSequenceFromLog from "~/db/get-sequence-by-id";
import { Log, Profile } from "~/db/types";
import { daysBetween } from "./cron";
import parseSequenceName from "./parse-sequence-name";

export default async function assignActionEvent(log: Log){
  log = await appendToLog(log, {
    status: 'assigning-action'
  })

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

  // only one prompt can be placed per day
  const todaysStepIndex = sequence.steps.findIndex((prompt: any) => {
    const today = new Date()
    const dateToSend = addDays(parseISO(log!.date!), prompt.delay)
    return daysBetween(today, dateToSend) === 0
  })

  if (todaysStepIndex === undefined || todaysStepIndex === null || todaysStepIndex === -1) {
    // log = await appendToLog(log, {
    //   status: 'error',
    //   errorMessage: 'No prompt for today'
    // })
    return log
  }

  const step = sequence.steps[todaysStepIndex] as any

  let action = 'draft'
  if (step && step.action) {
    action = step.action
  }
  
  log = await appendToLog(log, {
    status: `to-${action}`,
  })
  return log
}