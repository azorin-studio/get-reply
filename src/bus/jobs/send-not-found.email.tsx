import supabaseAdminClient from "~/supabase/supabase-admin-client"
import PromptNotFound from "~/components/emails/prompt-not-found"
import getLogById from "~/supabase/get-log-by-id"
import { render } from "@react-email/render"
import { sendMail } from "~/lib/send-mail"

export default async function sendNotFoundEmail (log_id: string, promptName: string) {
  const log = await getLogById(supabaseAdminClient, log_id)
  if (!log) throw new Error(`[action: ${log_id}]: log not found.`)

  const html = render(
    <PromptNotFound
      promptName={promptName}
    />
    , { pretty: true })

  await sendMail({
    from: `noreply@getreply.app`,
    to: (log.from as any).address,
    subject: `re: ${log.subject}`,
    html,
    messageId: log.messageId
  })

}