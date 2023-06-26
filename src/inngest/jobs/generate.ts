import { callGPT35Api } from "~/lib/chat-gpt"
import appendToAction from "~/supabase/append-to-action"
import appendToLog from "~/supabase/append-to-log"
import fetchAllPieces from "~/supabase/fetch-all-pieces-from-action-id"
import emailToPrompt from "~/lib/email-to-prompt"
import supabaseAdminClient from "~/supabase/supabase-admin-client"

export default async function generate (action_id: string) {
  let { action, log, prompt } = await fetchAllPieces(supabaseAdminClient, action_id)

  if (!prompt) {
    await appendToLog(supabaseAdminClient, log, { status: 'error', errorMessage: 'No prompt found' })
    await appendToAction(supabaseAdminClient, action, { status: 'error', errorMessage: 'No prompt found' })
    throw new Error('No prompt found')
  }

  if (!prompt.prompt) {
    await appendToLog(supabaseAdminClient, log, { status: 'error', errorMessage: 'Prompt has no body' })
    await appendToAction(supabaseAdminClient, action, { status: 'error', errorMessage: 'Prompt has no body' })
    throw new Error('Prompt has no body')
  }

  await appendToAction(supabaseAdminClient, action, { status: 'generating', errorMessage: null })
  await appendToLog(supabaseAdminClient, log, { status: 'generating', errorMessage: null})

  const fullPrompt = emailToPrompt({
    body: log.text, 
    subject: log.subject,
    prompt: prompt.prompt
  })

  try {
    const generation: string = await callGPT35Api(fullPrompt, 3)
    await appendToLog(supabaseAdminClient, log, { 
      status: 'generated', 
      // generation 
    })
    action = await appendToAction(supabaseAdminClient, action, { status: 'generated', fullPrompt, generation })  
    return action
  } catch (error: any) {
    await appendToLog(supabaseAdminClient, log, { status: 'error', errorMessage: `Error while generating: ${error.message}`})
    await appendToAction(supabaseAdminClient, action, { status: 'error', errorMessage: `Error while generating: ${error.message}`})
    throw new Error(error.message)
  }
}
