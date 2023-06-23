import { addMilliseconds, parseISO } from "date-fns"
import appendToLog from "~/lib/append-to-log"
import supabaseAdminClient from "~/lib/server-admin-client"
import { Log } from "~/lib/types"
import fetchAllPiecesFromLogId from "~/lib/fetch-all-pieces-from-log-id"

export default async function createActions (log_id: string): Promise<Log> {
  let { log, profile, sequence } = await fetchAllPiecesFromLogId(log_id!)

  await appendToLog(log, {
    user_id: profile.id,
    status: 'verifying',
    errorMessage: null,
    created_at: new Date().toISOString()
  })

  if (!log.text) {
    await appendToLog(log, { status: 'error', errorMesaage: 'No text found in incoming email' })
    throw new Error('No text found in incoming email')
  }

  try {
    const actions = await Promise.all(sequence.steps.map(async (step: any) => {
      // in days
      let msDelay = step.delay * 1000 * 60 * 60 * 24
      if (step.delayUnit === 'hours') {
        msDelay = step.delay * 1000 * 60 * 60
      }
      if (step.delayUnit === 'minutes') {
        msDelay = step.delay * 1000 * 60
      }
      if (step.delayUnit === 'seconds') {
        msDelay = step.delay * 1000
      }

      const { error, data: action } = await supabaseAdminClient
        .from('actions')
        .insert({
          // delay needs to be in ms
          run_date: addMilliseconds(parseISO(log!.date!), msDelay).toISOString(),
          prompt_id: step.prompt_id,
          prompt_name: step.prompt_name,
          generation: '', // placeholder
          mailId: '', // placeholder 
          log_id: log!.id,
          user_id: profile.id,
        })
        .select()

      if (error) throw error

      if (!action || action.length === 0) throw new Error('Could not create action')
      return action[0]
    }))

    console.log(`[log_id: ${log.id}] made actions: [${actions.map(action => action.id).join(', ')}]`)
    await appendToLog(log, { status: 'verified', action_ids: actions.map(action => action.id), })

    return log
  } catch (error: any) {
    log = await appendToLog(log, { status: 'error', errorMessage: error.message })
    throw error
  }
}
