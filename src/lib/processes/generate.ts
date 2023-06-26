import { callGPT35Api } from "~/lib/chat-gpt"
import appendToAction from "~/lib/append-to-action"
import appendToLog from "~/lib/append-to-log"
import fetchAllPieces from "~/lib/fetch-all-pieces-from-action-id"
import emailToPrompt from "~/lib/email-to-prompt"

export default async function generate (action_id: string) {
  let { action, log, prompt } = await fetchAllPieces(action_id)

  if (!prompt) {
    await appendToLog(log, { status: 'error', errorMessage: 'No prompt found' })
    await appendToAction(action, { status: 'error', errorMessage: 'No prompt found' })
    throw new Error('No prompt found')
  }

  if (!prompt.prompt) {
    await appendToLog(log, { status: 'error', errorMessage: 'Prompt has no body' })
    await appendToAction(action, { status: 'error', errorMessage: 'Prompt has no body' })
    throw new Error('Prompt has no body')
  }

  await appendToAction(action, { status: 'generating', errorMessage: null })
  await appendToLog(log, { status: 'generating', errorMessage: null})

  const fullPrompt = emailToPrompt({
    body: log.text, 
    subject: log.subject,
    prompt: prompt.prompt
  })

  try {
    const generation: string = await callGPT35Api(fullPrompt, 3)
    await appendToLog(log, { 
      status: 'generated', 
      // generation 
    })
    action = await appendToAction(action, { status: 'generated', fullPrompt, generation })  
    return action
  } catch (error: any) {
    await appendToLog(log, { status: 'error', errorMessage: `Error while generating: ${error.message}`})
    await appendToAction(action, { status: 'error', errorMessage: `Error while generating: ${error.message}`})
    throw new Error(error.message)
  }
}
