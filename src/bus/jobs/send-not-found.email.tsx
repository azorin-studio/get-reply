import { render } from "@react-email/render"

import PromptNotFound from "~/components/emails/prompt-not-found"
import { sendMail } from "~/lib/send-mail"
import { supabaseAdminClient } from "~/supabase/server-client"

import { getLogById } from "~/supabase/supabase"

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