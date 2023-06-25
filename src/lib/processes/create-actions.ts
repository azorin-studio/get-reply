import { addMilliseconds, parseISO } from "date-fns"
import appendToLog from "~/lib/append-to-log"
import supabaseAdminClient from "~/lib/server-admin-client"
import { Action, Log } from "~/lib/types"
import fetchAllPiecesFromLogId from "~/lib/fetch-all-pieces-from-log-id"
import calculateRunDate from "../calculate-run-date"
import parseDelayFromTags from "../parse-delay-from-tags"

export default async function createActions (log_id: string): Promise<{log: Log, actions: Action[]}> {
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
      // lets check if there are any delays in the tags
      const { delay, delayUnit } = parseDelayFromTags(log.tags)
      // if there is a delay, we need to calculate the run date
      // otherwise, we can just use the log date
      let run_date
      if (delay && delayUnit) {
        console.log(`[log_id: ${log.id}] found delay: ${delay} ${delayUnit}`)
        run_date = calculateRunDate(delay, delayUnit, log.date!)
      } else {
        console.log(`[log_id: ${log.id}] using step delay: ${step.delay} ${step.delayUnit}`)
        run_date = calculateRunDate(step.delay, step.delayUnit, log.date!)
      }

      const { error, data: action } = await supabaseAdminClient
        .from('actions')
        .insert({
          run_date,
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

    return { log, actions }
  } catch (error: any) {
    log = await appendToLog(log, { status: 'error', errorMessage: error.message })
    throw error
  }
}
