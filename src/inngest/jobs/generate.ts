import { callGPT35Api } from "~/lib/chat-gpt"
import appendToAction from "~/supabase/append-to-action"
import emailToPrompt from "~/lib/email-to-prompt"
import supabaseAdminClient from "~/supabase/supabase-admin-client"
import getActionById from "~/supabase/get-action-by-id"

export default async function generate (action_id: string) {
  let action = await getActionById(supabaseAdminClient, action_id)
  if (!action) throw new Error(`Action ${action_id} not found`)

  await appendToAction(supabaseAdminClient, action, { status: 'generating', errorMessage: null })

  const fullPrompt = emailToPrompt({
    body: action.log?.text, 
    subject: action.log?.subject,
    prompt: action.prompt.prompt!
  })

  try {
    const generation: string = await callGPT35Api(fullPrompt, 3)
    action = await appendToAction(supabaseAdminClient, action, { status: 'generated', fullPrompt, generation })  
    return action
  } catch (error: any) {
    await appendToAction(supabaseAdminClient, action, { status: 'error', errorMessage: `Error while generating: ${error.message}`})
    throw new Error(error.message)
  }
}
