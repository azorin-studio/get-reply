import appendToAction from "~/db-admin/append-to-action"
import getProfileFromEmail from "~/db-admin/get-profile-from-email"
import getSequenceFromLog from "~/db-admin/get-sequence-by-id"
import { Action, Log, Profile, Prompt, Sequence } from "~/db-admin/types"
import getActionById from "~/db-admin/get-action-by-id"
import getLogById from "~/db-admin/get-log-by-id"
import getPromptById from "~/db-admin/get-prompt-by-id"
import appendToLog from "~/db-admin/append-to-log"
import parseSequenceName from "~/inngest/parse-sequence-name"

export default async function fetchAllPiecesFromActionId(action_id: string): Promise<{ 
  action: Action, 
  log: Log,
  prompt: Prompt,
  profile: Profile,
  sequence: Sequence
}>{
  let action = await getActionById(action_id)
  if (!action) throw new Error(`Action ${action_id} not found`)
  
  let log = await getLogById(action.log_id!)
  if (!log) throw new Error(`Log ${action.log_id} not found`)

  const prompt = await getPromptById(action.prompt_id!)

  if (!prompt) {
    await appendToLog(log, { status: 'error', errorMessage: `Prompt ${action.prompt_id} not found` })
    await appendToAction(action, { status: 'error', errorMessage: `Prompt ${action.prompt_id} not found` })
    throw new Error(`Prompt ${action.prompt_id} not found`)
  }

  await appendToAction(action, { status: 'sending', errorMessage: null })

  if (!log.from) throw new Error('No from address found in action')

  const profile: Profile = await getProfileFromEmail((log.from as any).address)
  if (!profile.refresh_token) {
    await appendToAction(action, { status: 'error', errorMessage: 'No google refresh token found for this email' })
    await appendToLog(log, { status: 'error', errorMessage: 'No google refresh token found for this email' })
    throw new Error('No google refresh token found for this email')
  }

  const sequence = await getSequenceFromLog(log)
  if (!sequence) throw new Error('Could not find sequence')
  
  if (!sequence.steps || sequence.steps.length === 0) {
    const { sequenceName } = parseSequenceName(log)
    await appendToLog(log, { status: 'error', errorMessage: `[sequence:${sequenceName}] has no steps` })
    throw new Error(`[sequence:${sequenceName}] has no steps`)
  }

  if (!prompt.prompt) {
    await appendToLog(log, { status: 'error', errorMessage: 'No prompt found' })
    await appendToAction(action, { status: 'error', errorMessage: 'No prompt found' })
    throw new Error('No prompt found')
  }

  if (!log.text) {
    await appendToLog(log, { status: 'error', errorMessage: 'No text found' })
    await appendToAction(action, { status: 'error', errorMessage: 'No text found' })
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