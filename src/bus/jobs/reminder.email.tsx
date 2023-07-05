import { supabaseAdminClient } from "~/supabase/server-client"
import { sendMail } from "~/lib/send-mail"
import { render } from "@react-email/render"
import FollowUpReminder from "~/components/emails/followup-reminder"
import { getActionById, appendToAction, appendToLog } from "~/supabase/supabase"

export default async function reminder(action_id: string): Promise<void>{
  const action = await getActionById(supabaseAdminClient, action_id)
  if (!action) throw new Error(`Action ${action_id} not found`)

  if (action.log.status === 'cancelled' || action.status === 'cancelled') {
    return
  }

  const to =  action.log.to?.filter((t: any) => t?.address.endsWith('@getreply.app')).map((t: any) => t.address).join(', ')
  const cc = action.log.cc?.filter((t: any) => t?.address.endsWith('@getreply.app')).map((t: any) => t.address).join(', ')
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

  await appendToAction(supabaseAdminClient, action, { status: 'complete' })
  await appendToLog(supabaseAdminClient, action.log, {status: 'complete' })

  return
}
