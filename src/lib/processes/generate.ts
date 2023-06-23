import replyParser from "node-email-reply-parser"
import { callGPT35Api } from "~/lib/chat-gpt"
import appendToAction from "~/lib/append-to-action"
import appendToLog from "~/lib/append-to-log"
import fetchAllPieces from "~/lib/fetch-all-pieces-from-action-id"
import emailToPrompt from "~/lib/email-to-prompt"

export default async function generate (action_id: string) {
  let { action, log, prompt } = await fetchAllPieces(action_id)

  await appendToAction(action, { status: 'generating', errorMessage: null })
  await appendToLog(log, { status: 'generating', errorMessage: null})

  const fullPrompt = emailToPrompt(log.text!, prompt.prompt!)

  try {
    const generation: string = await callGPT35Api(fullPrompt, 3)
    action = await appendToAction(action, {
      status: 'generated',
      fullPrompt,
      generation
    })
  
    return action
  
  } catch (error: any) {
    await appendToLog(log, { status: 'error', errorMessage: `Error while generating: ${error.message}`})
    await appendToAction(action, { status: 'error', errorMessage: `Error while generating: ${error.message}`})
    throw new Error(error.message)
  }

}
