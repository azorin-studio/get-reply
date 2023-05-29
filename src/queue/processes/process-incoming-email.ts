import { addDays, parseISO } from "date-fns"
import appendToLog from "~/db-admin/append-to-log"
import createLog from "~/db-admin/create-log"
import getProfileFromEmail from "~/db-admin/get-profile-from-email"
import getSequenceFromLog from "~/db-admin/get-sequence-by-id"
import supabaseAdminClient from "~/db-admin/server-admin-client"
import { IncomingEmail, Log, Profile } from "~/db-admin/types"
import parseSequenceName from "~/queue/parse-sequence-name"

export default async function verifyIncomingEmail (incomingEmail: IncomingEmail): Promise<Log> {
  let log: Log | null = null
  try {
    log = await createLog(incomingEmail)
  } catch (err: any) {
    throw err
  }

  if (!log.from) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'No from address found in log'
    })

    return log
  }

  const profile: Profile = await getProfileFromEmail(log.from.address)

  if (!profile) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'No profile found for this email'
    })
  }

  log = await appendToLog(log, {
    user_id: profile.id,
  })

  log = await appendToLog(log, {
    status: 'verifying',
    errorMessage: null,
    created_at: new Date().toISOString()
  })

  if (!log.text) {
    log = await appendToLog(log, {
      status: 'error',
      errorMesaage: 'No text found in incoming email'
    })
    return log
  }

  const sequence = await getSequenceFromLog(log)
  if (!sequence || !sequence.steps || sequence.steps.length === 0) {
    const sequenceName = parseSequenceName(log)
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

  const actions = await Promise.all(sequence.steps.map(async (step: any) => {
    const { error, data: action } = await supabaseAdminClient
      .from('actions')
      .insert({
        run_date: addDays(parseISO(log!.date!), step.delay),
        prompt_id: step.prompt_id,
        name: step.action || 'draft',
        generation: '', // placeholder
        mailId: '', // placeholder 
        log_id: log!.id,
        user_id: profile.id,
      })
      .select()

    if (error) {
      throw error
    }

    if (!action || action.length === 0) {
      throw new Error('Could not create action')
    }

    return action[0]
  }))

  log = await appendToLog(log, {
    status: 'scheduling',
    actions_ids: actions.map(action => action.id),
  })

  return log
}
