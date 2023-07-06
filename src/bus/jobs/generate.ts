import { callGPT35Api } from "~/lib/chat-gpt"
import emailToPrompt from "~/lib/email-to-prompt"
import { getActionById, appendToAction } from "~/supabase/supabase"
import { supabaseAdminClient } from "~/supabase/server-client"

export default async function generate (action_id: string) {
  let action = await getActionById(supabaseAdminClient, action_id)
  if (!action) throw new Error(`Action ${action_id} not found`)
  const fullPrompt = emailToPrompt({
    body: action.log?.text, 
    subject: action.log?.subject,
    prompt: action.prompt.prompt!
  })
  
  
  const generation: string = await callGPT35Api(fullPrompt, 3)
  await appendToAction(supabaseAdminClient, action, { status: 'generated', fullPrompt, generation })
  return action
}
