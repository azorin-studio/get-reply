import { supabaseAdminClient } from "~/supabase/server-client"
import { sendMail } from "~/lib/send-mail"
import { render } from "@react-email/render"
import FollowUpReminder from "~/components/emails/followup-reminder"
import { getActionByKey, appendToAction, appendToLog } from "~/supabase/supabase"

export default async function reminder(action_id: string): Promise<void>{
  const action = await getActionByKey(supabaseAdminClient, 'id', action_id)
  if (!action) throw new Error(`Action ${action_id} not found`)

  if (action.log.status === 'cancelled' || action.status === 'cancelled') {
    console.log(`Action ${action_id} is cancelled`)
    return
  }
  if (action.status !== 'sleeping') throw new Error(`Action ${action_id} is not sleeping`)
  if (!action.run_date) throw new Error(`Action ${action_id} has no run_date`)

  const runDate = new Date(action.run_date)
  console.log(
    new Date(),
    runDate,
    'runDate > new Date()',
    runDate > new Date()
  )

  if (new Date(runDate) > new Date()) {
    console.log(`Action ${action_id} is not ready to run yet`)
    return
  }

  console.log(`Sending reminder for action ${action_id}`)

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

  await appendToAction(supabaseAdminClient, action.id, { status: 'complete' })
  await appendToLog(supabaseAdminClient, action.log.id, {status: 'complete' })

  return
}
