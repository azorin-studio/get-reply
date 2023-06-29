import { render } from "@react-email/render"
import FollowUpConfirmation from "~/components/emails/followup-confirmation"
import sendMail from "~/lib/send-mail"
import { inngest } from '~/inngest/inngest'
import supabaseAdminClient from '~/supabase/supabase-admin-client'
import getLogById from "~/supabase/get-log-by-id"

export default inngest.createFunction(
  { name: "confirmation-email", retries: 0 },
  { event: "queue/confirmation-email" },
  async ({ event }: { event: any, step: any }) => {
    console.log(`[action: ${event.data.log_id}]: sending confirmation email.`)

    const log = await getLogById(supabaseAdminClient, event.data.log_id)
    if (!log) {
      throw new Error(`[action: ${event.data.log_id}]: log not found.`)
    }
   
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
