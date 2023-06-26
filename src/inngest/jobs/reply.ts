import appendToAction from "~/supabase/append-to-action"
import { Action } from "~/supabase/types"
import sendMail from "~/lib/send-mail"
import appendToLog from "~/supabase/append-to-log"
import fetchAllPiecesFromActionId from "~/supabase/fetch-all-pieces-from-action-id"
import supabaseAdminClient from "~/supabase/supabase-admin-client"

export const introText = `Here is your reply from ChatGPT:`

export default async function reply(action_id: string): Promise<Action>{
  let { action, log, sequence } = await fetchAllPiecesFromActionId(supabaseAdminClient, action_id)

  let text = `${introText}\n\n${action.generation as string}`

  await sendMail({
    from: `${sequence.name}@getreply.app`,
    to: (log.from as any).address,
    subject: `re: ${log.subject}`,
    text,
    messageId: log.messageId
  })

  await appendToAction(supabaseAdminClient, action, { status: 'sent' })
  await appendToLog(supabaseAdminClient, log, {status: 'complete' })

  return action    
}
