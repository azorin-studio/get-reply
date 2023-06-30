import { render } from "@react-email/render"
import FollowUpConfirmation from "~/components/emails/followup-confirmation"
import sendMail from "~/lib/send-mail"
import { inngest } from '~/inngest/inngest'
import supabaseAdminClient from '~/supabase/supabase-admin-client'
import getLogById from "~/supabase/get-log-by-id"
import parsePromptNamesAndTags from "~/lib/parse-prompt-names-and-tags"

export default inngest.createFunction(
  { name: "confirmation-email", retries: 0 },
  { event: "queue/confirmation-email" },
  async ({ event }: { event: any, step: any }) => {
    console.log(`[action: ${event.data.log_id}]: sending confirmation email.`)

    const log = await getLogById(supabaseAdminClient, event.data.log_id)
    if (!log) {
      throw new Error(`[action: ${event.data.log_id}]: log not found.`)
    }
   
    const promptsAndTags = parsePromptNamesAndTags({
      to: log.to,
      cc: log.cc,
      bcc: log.bcc,
    })
  
    const to = promptsAndTags.map(({ promptName, tags }) => {
      return `${promptName}${tags.map(t => `+${t}`).join('')}@getreply.app`
    }).join(', ') 

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
