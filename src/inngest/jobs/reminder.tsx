import appendToAction from "~/supabase/append-to-action"
import { Action } from "~/supabase/types"
import sendMail from "~/lib/send-mail"
import { render } from "@react-email/render"
import FollowUpReminder from "~/components/emails/followup-reminder"
import supabaseAdminClient from "~/supabase/supabase-admin-client"
import getActionById from "~/supabase/get-action-by-id"
import appendToLog from "~/supabase/append-to-log"

export default async function reminder(action_id: string): Promise<Action>{
  const action = await getActionById(supabaseAdminClient, action_id)
  if (!action) throw new Error(`Action ${action_id} not found`)

  const to=  action.log.to?.filter(t => !t.address.endsWith('@getreply.app')).map(t => t.address).join(', ')
  const cc = action.log.cc?.filter(t => !t.address.endsWith('@getreply.app')).map(t => t.address).join(', ')
  const body = action.generation as string
  const promptId = action.prompt.id as string

  const html = render(
    <FollowUpReminder 
      to={to}
      cc={cc}
      delay={action.delay}
      delayUnit={action.delay_unit}
      subject={action.log.subject as string}
      body={body}
      promptId={promptId}
    />
    , { pretty: true })
      
  await sendMail({
    from: `noreply@getreply.app`,
    to: (action.log.from as any).address,
    subject: `re: ${action.log.subject}`,
    html,
    messageId: action.log.messageId
  })

  await appendToAction(supabaseAdminClient, action, { status: 'sent' })
  await appendToLog(supabaseAdminClient, action.log, {status: 'complete' })

  return action    
}
