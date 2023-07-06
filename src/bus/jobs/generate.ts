import { callGPT35Api } from "~/lib/chat-gpt"
import emailToPrompt from "~/lib/email-to-prompt"
import { getActionById, appendToAction } from "~/supabase/supabase"
import { supabaseAdminClient } from "~/supabase/server-client"

export default async function generate (action_id: string) {
  console.log('gg1')
  let action = await getActionById(supabaseAdminClient, action_id)
  console.log('gg2')
  if (!action) throw new Error(`Action ${action_id} not found`)
  console.log('gg3')

  const fullPrompt = emailToPrompt({
    body: action.log?.text, 
    subject: action.log?.subject,
    prompt: action.prompt.prompt!
  })
  console.log('gg4')

  const generation: string = await callGPT35Api(fullPrompt, 3)
  console.log('gg5')
  await appendToAction(supabaseAdminClient, action, { status: 'generated', fullPrompt, generation })
  console.log('gg6')
  return action
}
