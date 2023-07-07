import { appendToLog, createAction, createLog, getPromptByKey } from "~/supabase/supabase"
import { Action, IncomingEmail, Log } from "~/supabase/types"
import { supabaseAdminClient } from "~/supabase/server-client"
import parsePromptNamesAndTags from "~/lib/parse-prompt-names-and-tags"
import calculateRunDate from "~/lib/calculate-run-date"
import parseDelayFromTags from "~/lib/parse-delay-from-tags"

export default async function receive (incomingEmail: IncomingEmail): Promise<{ actions: Action[], log: Log | null }> {
  const log: Log | null  = await createLog(supabaseAdminClient, incomingEmail)
  if (!log) return { log: null, actions: [] }

  const promptsAndTags = parsePromptNamesAndTags({
    to: log.to,
    cc: log.cc,
    bcc: log.bcc,
  })

  if (!promptsAndTags) {
    await appendToLog(supabaseAdminClient, log.id, { status: 'error', errorMessage: 'No getreply email found in incoming email' })
    throw new Error('No getreply email found in incoming email')
  }

  const actions = await Promise.all(
    promptsAndTags.map(async ({ promptName, tags }: { promptName: string, tags: string[] }) => {
      const prompt = await getPromptByKey(supabaseAdminClient, 'name', promptName)

      if (!prompt) {
        await appendToLog(supabaseAdminClient, log.id, { status: 'error', errorMessage: `No prompt found with name ${promptName}` })
        return null
      }

      const p = parseDelayFromTags(tags)
      const delay = p.delay || 0
      const delayUnit = p.delayUnit || 'seconds'
      const run_date = calculateRunDate(delay, delayUnit, log.date!)
  
      return createAction(supabaseAdminClient, {
        profile_id: log.profile_id,
        log_id: log.id,
        prompt_id: prompt.id,
        run_date,
        delay,
        delay_unit: delayUnit,
      })
    })
  )
  return {
    actions: actions.filter(action => action !== null) as Action[],
    log
  }
}