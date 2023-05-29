import { callGPT35Api } from "~/chat-gpt"
import appendToAction from "~/db-admin/append-to-action"
import getActionById from "~/db-admin/get-action-by-id"
import getLogById from "~/db-admin/get-log-by-id"
import getPromptById from "~/db-admin/get-prompt-by-id"

export default async function generate (action_id: string) {
  let action = await getActionById(action_id)
  
  if (!action) {
    throw new Error(`Action ${action_id} not found`)
  }

  const prompt = await getPromptById(action.prompt_id!)

  if (!prompt) {
    throw new Error(`Prompt ${action.prompt_id} not found`)
  }

  const log = await getLogById(action.log_id!)

  if (!log) {
    throw new Error(`Log ${action.log_id} not found`)
  }

  action = await appendToAction(action, {
    status: 'generating'
  })

  const fullPrompt = (prompt.prompt as string).replace('{email}', log.text!)
  const generation: string = await callGPT35Api(fullPrompt, 3)

  action = await appendToAction(action, {
    status: 'generated',
    generation
  })

  return action
}
