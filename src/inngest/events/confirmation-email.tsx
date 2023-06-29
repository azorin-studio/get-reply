import { render } from "@react-email/render"
import FollowUpConfirmation from "~/components/emails/followup-confirmation"
import sendMail from "~/lib/send-mail"
import { inngest } from '~/inngest/inngest'
import getLogById from '~/supabase/get-log-by-id'
import supabaseAdminClient from '~/supabase/supabase-admin-client'
import getActionById from '~/supabase/get-action-by-id'

export default inngest.createFunction(
  { name: "confirmation-email", retries: 0 },
  { event: "queue/confirmation-email" },
  async ({ event }: { event: any, step: any }) => {
    console.log(`[log_id: ${event.data.log_id}]: sending confirmation email.`)

    const log = await getLogById(supabaseAdminClient, event.data.log_id)
    if (!log || !log.id) {
      console.log(`[log_id: ${event.data.log_id}]: log not found. Quitting.`)
      return
    }

    if (!log.action_ids) {
      console.log(`[log_id: ${event.data.log_id}]: no actions found. Quitting.`)
      return
    }

    const allGenerated = await Promise.all(
      log?.action_ids?.map(async (action_id: string) => {
        const action = await getActionById(supabaseAdminClient, action_id)
        // if action status is not 'generated' we quit
        console.log({ id: action!.id, status: action!.status })
        if (action?.status === 'generated' || action?.status === 'pending') return true
        return false
      })
    )

    if (allGenerated.includes(false)) {
      console.log(`[log_id: ${event.data.log_id}]: not all actions are generated. Quitting.`)
      return
    }

    // send email with confirmation
    const to = log.to?.filter(t => !t.address.endsWith('@getreply.app')).map(t => t.address).join(', ')
    const html = render(
      <FollowUpConfirmation
        to={to}
        id={log.id}
      />
      , { pretty: true })

    await sendMail({
      from: `noreply@getreply.app`,
      to: (log.from as any).address,
      subject: `re: ${log.subject}`,
      html,
      messageId: log.messageId
    })
    
    return { event, body: log }
  }
)
