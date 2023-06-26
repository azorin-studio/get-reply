import appendToAction from "~/supabase/append-to-action"
import getProfileFromEmail from "~/supabase/get-profile-from-email"
import { Action, Log, Profile, Prompt, Sequence } from "~/supabase/types"
import getActionById from "~/supabase/get-action-by-id"
import getLogById from "~/supabase/get-log-by-id"
import getPromptById from "~/supabase/get-prompt-by-id"
import appendToLog from "~/supabase/append-to-log"
import parseSequenceName from "~/lib/parse-sequence-name"
import { SupabaseClient } from "@supabase/supabase-js"

export default async function fetchAllPiecesFromActionId(client: SupabaseClient, action_id: string): Promise<{ 
  action: Action, 
  log: Log,
  prompt: Prompt,
  profile: Profile,
  sequence: Sequence
}>{
  let action = await getActionById(client, action_id)
  if (!action) throw new Error(`Action ${action_id} not found`)
  
  let log = await getLogById(client, action.log_id!)
  if (!log) throw new Error(`Log ${action.log_id} not found`)

  const prompt = await getPromptById(client, action.prompt_id!)

  if (!prompt) {
    await appendToLog(client, log, { status: 'error', errorMessage: `Prompt ${action.prompt_id} not found` })
    await appendToAction(client, action, { status: 'error', errorMessage: `Prompt ${action.prompt_id} not found` })
    throw new Error(`Prompt ${action.prompt_id} not found`)
  }

  await appendToAction(client, action, { status: 'sending', errorMessage: null })

  if (!log.from) throw new Error('No from address found in action')

  const profile: Profile = await getProfileFromEmail(client, (log.from as any).address)
  if (!profile.refresh_token) {
    await appendToAction(client, action, { status: 'error', errorMessage: 'No google refresh token found for this email' })
    await appendToLog(client, log, { status: 'error', errorMessage: 'No google refresh token found for this email' })
    throw new Error('No google refresh token found for this email')
  }

  const sequence = log.sequence
  if (!sequence) throw new Error('Could not find sequence')
  
  if (!sequence.steps || sequence.steps.length === 0) {
    const { sequenceName } = parseSequenceName({
      to: log.to,
      cc: log.cc,
      bcc: log.bcc,
      headers: log.headers
    })
    await appendToLog(client, log, { status: 'error', errorMessage: `[sequence:${sequenceName}] has no steps` })
    throw new Error(`[sequence:${sequenceName}] has no steps`)
  }

  if (!prompt.prompt) {
    await appendToLog(client, log, { status: 'error', errorMessage: 'No prompt found' })
    await appendToAction(client, action, { status: 'error', errorMessage: 'No prompt found' })
    throw new Error('No prompt found')
  }

  if (!log.text) {
    await appendToLog(client, log, { status: 'error', errorMessage: 'No text found' })
    await appendToAction(client, action, { status: 'error', errorMessage: 'No text found' })
    throw new Error('No text found')
  }

  return {
    action,
    log,
    prompt,
    profile,
    sequence
  }
}
