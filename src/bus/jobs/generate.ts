import { callGPT35Api } from "~/lib/chat-gpt"
import emailToPrompt from "~/lib/email-to-prompt"
import { getActionById, appendToAction } from "~/supabase/supabase"
import { supabaseAdminClient } from "~/supabase/server-client"

export default async function generate (action_id: string) {
  console.log(1)
  let action = await getActionById(supabaseAdminClient, action_id)
  console.log(2)
  if (!action) throw new Error(`Action ${action_id} not found`)
  console.log(3)
  const fullPrompt = emailToPrompt({
    body: action.log?.text, 
    subject: action.log?.subject,
    prompt: action.prompt.prompt!
  })
  console.log(4)
  
  const generation: string = await callGPT35Api(fullPrompt, 3)
  console.log(5)
  await appendToAction(supabaseAdminClient, action, { status: 'generated', fullPrompt, generation })
  console.log(6)
  return action
}
