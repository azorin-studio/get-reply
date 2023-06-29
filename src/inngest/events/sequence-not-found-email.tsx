import { render } from "@react-email/render"
import SequenceNotFound from "~/components/emails/sequence-not-found"
import sendMail from "~/lib/send-mail"
import { inngest } from '~/inngest/inngest'
import supabaseAdminClient from '~/supabase/supabase-admin-client'
import getLogById from "~/supabase/get-log-by-id"

export default inngest.createFunction(
  { name: "sequence-not-found-email-", retries: 0 },
  { event: "queue/sequence-not-found-email" },
  async ({ event }: { event: any, step: any }) => {
    console.log(`[action: ${event.data.log_id}]: sending sequence not found email.`)

    const log = await getLogById(supabaseAdminClient, event.data.log_id)
    if (!log) {
      throw new Error(`[action: ${event.data.log_id}]: log not found.`)
    }
   
    const html = render(
      <SequenceNotFound
        sequenceName={event.data.promptName}
      />
      , { pretty: true })

    // console.log({
    //   from: `noreply@getreply.app`,
    //   to: (log.from as any).address,
    //   subject: `re: ${log.subject}`,
    //   html,
    //   messageId: log.messageId
    // })

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
