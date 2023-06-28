import appendToLog from "~/supabase/append-to-log"
import supabaseAdminClient from "~/supabase/supabase-admin-client"
import { Action, Log } from "~/supabase/types"
import fetchAllPiecesFromLogId from "~/supabase/fetch-all-pieces-from-log-id"
import calculateRunDate from "~/lib/calculate-run-date"
import parseDelayFromTags from "~/lib/parse-delay-from-tags"

export default async function createActions (log_id: string): Promise<{log: Log, actions: Action[]}> {
  let { log, profile, sequence } = await fetchAllPiecesFromLogId(supabaseAdminClient, log_id!)

  await appendToLog(supabaseAdminClient, log, {
    user_id: profile.id,
    status: 'verifying',
    errorMessage: null,
    created_at: new Date().toISOString()
  })

  if (!log.text) {
    await appendToLog(supabaseAdminClient, log, { status: 'error', errorMesaage: 'No text found in incoming email' })
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

    console.log(`[log_id: ${log.id}] appending new actions: [${actions.map(action => action.id).join(', ')}]`)
    await appendToLog(supabaseAdminClient, log, { 
      status: 'verified', 
      action_ids: [
        ...log.action_ids || [],
        ...actions.map(action => action.id)
      ]
    })

    return { log, actions }
  } catch (error: any) {
    console.log(error)
    log = await appendToLog(supabaseAdminClient, log, { status: 'error', errorMessage: error.message })
    throw error
  }
}
