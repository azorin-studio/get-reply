import calculateRunDate from "~/lib/calculate-run-date"
import parseDelayFromTags from "~/lib/parse-delay-from-tags"
import parsePromptNamesAndTags from "~/lib/parse-prompt-names-and-tags"
import { getPromptByName, getLogById, appendToLog, supabaseAdminClient } from "~/supabase/supabase"
import { Action, Status } from "~/supabase/types"

export default async function createActions (log_id: string): Promise<Action[]> {
  const log = await getLogById(supabaseAdminClient, log_id)
  if(!log) throw new Error(`Log ${log_id} not found`)

  if (!log.text) {
    await appendToLog(supabaseAdminClient, log, { status: 'error', errorMessage: 'No text found in incoming email' })
    throw new Error('No text found in incoming email')
  }

  
  await appendToLog(supabaseAdminClient, log, {
    profile_id: log.profile.id,
    status: 'recieved' as Status,
    errorMessage: null,
    created_at: new Date().toISOString()
  })


  try {
    const promptsAndTags = parsePromptNamesAndTags({
      to: log.to,
      cc: log.cc,
      bcc: log.bcc,
    })
  
    if (!promptsAndTags) {
      await appendToLog(supabaseAdminClient, log, { status: 'error', errorMessage: 'No getreply email found in incoming email' })
      throw new Error('No getreply email found in incoming email')
    }

    const actions = await Promise.all(
      promptsAndTags.map(async ({ promptName, tags }: { promptName: string, tags: string[] }) => {
        const prompt = await getPromptByName(supabaseAdminClient, promptName)

        if (!prompt) {
          await appendToLog(supabaseAdminClient, log, { status: 'error', errorMessage: `No prompt found with name ${promptName}` })
          // await send({
          //   name: 'queue/prompt-not-found-email',
          //   id: `queue/prompt-not-found-email-${log.id}`,
          //   data: { log_id: log.id, promptName }
          // })
          return null
        }

        const p = parseDelayFromTags(tags)
        const delay = p.delay || 0
        const delayUnit = p.delayUnit || 'seconds'
        const run_date = calculateRunDate(delay, delayUnit, log.date!)
    
        const { error, data: actions } = await supabaseAdminClient
          .from('actions')
          .insert({
            profile_id: log.profile.id,
            log_id: log.id,
            prompt_id: prompt.id,
            run_date,
            delay: delay,
            delay_unit: delayUnit,
            generation: '',
          })
          .select()
          .limit(1)
    
        if (error) throw error
        if (!actions || actions.length === 0) throw new Error('Could not create action')      
        const action = actions[0]
        return action
      })
    )
    await appendToLog(supabaseAdminClient, log, { status: 'verified' })
    return actions.filter(action => action !== null) as Action[]
  } catch (error: any) {
    await appendToLog(supabaseAdminClient, log, { status: 'error', errorMessage: error.message })
    throw error
  }
}
